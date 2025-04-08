# TODO: Translate this code from flask into quart
# I decided to use flask for now because I am more familiar with it
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import traci
import time
import threading
from dotenv import load_dotenv
import os

load_dotenv()
MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")

app = Flask(__name__)
app.config['SECRET_KEY'] = 'A34F6g7JK0c5N'
socketio = SocketIO(app, async_mode='threading', cors_allowed_origins="*")

# Configurations
SUMO_BINARY = "sumo"  # or "sumo-gui" for the GUI version
SUMO_CFG_FILE = "OremConfig/osm.sumocfg" # path to sumo config file

output_dir = "/shared/output"
output_files = ["summary.xml", "tripinfo.xml"]

# Make sure the output directory exists
os.makedirs(output_dir, exist_ok=True)

# Pre-create empty output files to avoid SUMO errors
for file in output_files:
    full_path = os.path.join(output_dir, file)
    if not os.path.exists(full_path):
        with open(full_path, "w") as f:
            f.write("")  # Create an empty file

# Global control variables
paused = False
pause_condition = threading.Condition()

def sumo_simulation():
    # start SUMO simulation
    traci.start([SUMO_BINARY, "-c", SUMO_CFG_FILE, "--start"])

    socketio.emit("simulationStarted")
    while traci.simulation.getMinExpectedNumber() > 0:
        # Pause mechanism
        with pause_condition:
            while paused:
                pause_condition.wait()

        traci.simulationStep()
        vehicles = []

        for vehicle_id in traci.vehicle.getIDList():
            position = traci.vehicle.getPosition(vehicle_id)
            gps_position = traci.simulation.convertGeo(*position)
            angle = traci.vehicle.getAngle(vehicle_id)  # Vehicle orientation in degrees
            vehicles.append({'id': vehicle_id, 'x': gps_position[0], 'y': gps_position[1], 'angle': angle})

            # Animate each vehicle as they appear one by one
            socketio.emit('update', vehicles)
            time.sleep(0.001)  # Emit every second. Adjust here to reduce the overall vehicle speed.

        # Animate all in one shot
        socketio.emit('update', vehicles)
        time.sleep(0.001)  # Emit every second. Adjust here to reduce the overall vehicle speed.

    traci.close()
    socketio.emit("simulationEnded")

@socketio.on('play')
def handle_play():
    global sumo_thread, paused
    if 'sumo_thread' not in globals() or not sumo_thread.is_alive():
        sumo_thread = threading.Thread(target=sumo_simulation)
        sumo_thread.start()
    else:
        # Unpause the simulation
        with pause_condition:
            paused = False
            pause_condition.notify_all()
        socketio.emit("resumed")

@socketio.on('pause')
def handle_pause():
    global paused
    with pause_condition:
        paused = True
    socketio.emit("paused")

@app.route('/')
def index():
    return render_template('index.html', mapbox_token=MAPBOX_TOKEN)

if __name__ == "__main__":
    sumo_thread = threading.Thread(target=sumo_simulation)
    socketio.run(app, debug=True, host="0.0.0.0", allow_unsafe_werkzeug=True)  # make sure to set allow_unsafe_werkzeug to True
