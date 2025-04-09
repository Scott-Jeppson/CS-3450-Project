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
SUMO_CFG_FILE = "OremConfig/osm.sumocfg"  # path to sumo config file

output_dir = "/shared/output"
output_files = ["summary.xml", "tripinfo.xml"]

# Global control variables
paused = False
pause_condition = threading.Condition()
traffic_level = "medium"  # Default traffic level
sumo_thread = None  # Track the simulation thread

# Ensure output directory and files exist
os.makedirs(output_dir, exist_ok=True)
for file in output_files:
    full_path = os.path.join(output_dir, file)
    if not os.path.exists(full_path):
        with open(full_path, "w") as f:
            f.write("")  # Create empty files to prevent SUMO errors

def sumo_simulation():
    print(f"Running simulation with traffic level: {traffic_level}")

    # TODO: Generate different traffic patterns based on traffic_level here
    # Example placeholder:
    # if traffic_level == "low":
    #     generate_trips(rate=5)
    # elif traffic_level == "medium":
    #     generate_trips(rate=15)
    # elif traffic_level == "high":
    #     generate_trips(rate=30)

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
            angle = traci.vehicle.getAngle(vehicle_id)
            vehicles.append({'id': vehicle_id, 'x': gps_position[0], 'y': gps_position[1], 'angle': angle})

        socketio.emit('update', vehicles)
        time.sleep(0.001)  # Adjust this value to slow down or speed up simulation animation

    traci.close()
    socketio.emit("simulationEnded")

@socketio.on('setTrafficLevel')
def handle_set_traffic_level(data):
    global traffic_level
    level = data.get('level')
    if level in ['low', 'medium', 'high']:
        traffic_level = level
        print(f"Traffic level set to: {traffic_level}")
        emit("trafficLevelConfirmed", {"level": traffic_level})
    else:
        emit("error", {"message": "Invalid traffic level"})

@socketio.on('play')
def handle_play():
    global sumo_thread, paused
    if sumo_thread is None or not sumo_thread.is_alive():
        sumo_thread = threading.Thread(target=sumo_simulation)
        sumo_thread.start()
    else:
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
    socketio.run(app, debug=True, host="0.0.0.0", allow_unsafe_werkzeug=True)
