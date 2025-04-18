from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import traci
import time
import threading
from dotenv import load_dotenv
import os
import subprocess
import xml.etree.ElementTree as ET
import sys
sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)


# Load environment variables and set up paths
os.environ['SUMO_HOME'] = "/usr/share/sumo"  # Adjust if needed
load_dotenv()
MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'A34F6g7JK0c5N'
socketio = SocketIO(app, async_mode='threading', cors_allowed_origins="*")

# SUMO configuration
SUMO_BINARY = "sumo"  # Or "sumo-gui" for visual testing
SUMO_CFG_FILE = "OremConfig/osm.sumocfg"

# Output file setup
output_dir = "/shared/output"
output_files = ["summary.xml", "tripinfo.xml", "emmisions.xml"]

# Global control variables
paused = False
pause_condition = threading.Condition()
traffic_level = "medium"  # Default traffic level
sumo_thread = None  # Track the simulation thread

# Ensuring that output directory and files exist
os.makedirs(output_dir, exist_ok=True)
for file in output_files:
    full_path = os.path.join(output_dir, file)
    if not os.path.exists(full_path):
        with open(full_path, "w") as f:
            f.write("")

# Global control variables
paused = False
pause_condition = threading.Condition()
traffic_level = "medium"
sumo_thread = None

def inject_vehicle_type_to_trips(trips_file):
    with open(trips_file, "r") as f:
        lines = f.readlines()

    for i, line in enumerate(lines):
        if "<routes" in line:
            lines.insert(i + 1, '    <vType id="car" accel="2.0" decel="4.5" sigma="0.5" length="5.0" minGap="2.5" maxSpeed="25" guiShape="passenger"/>\n')
            break

    with open(trips_file, "w") as f:
        f.writelines(lines)

def generate_background_traffic(rate):
    import os
    import subprocess

    # Map traffic level to binomial/period settings
    rate_map = {
        "low": {"binomial": 1, "period": 5},
        "medium": {"binomial": 3, "period": 3},
        "high": {"binomial": 6, "period": 2}
    }

    binomial = rate.get("binomial", 3)
    period = rate.get("period", 3)

    base_path = "/sumo/OremConfig"
    net_path = os.path.join(base_path, "osm.net.xml.gz")
    trips_path = os.path.join(base_path, "background.trips.xml")
    route_path = os.path.join(base_path, "background.rou.xml")

    # Clean up any old files
    for f in [trips_path, route_path]:
        if os.path.exists(f):
            os.remove(f)

    try:
        # Step 1: Generate trips
        result1 = subprocess.run([
            "python3", "/usr/local/share/sumo/tools/randomTrips.py",
            "-n", net_path,
            "-o", trips_path,
            "--seed", "42",
            "--trip-attributes", 'type="car"',
            "--binomial", str(binomial),
            "--prefix", "car",
            "--begin", "0",
            "--end", "3600",
            "--period", str(period)
        ], check=True, capture_output=True, text=True)

        # Inject vehicle type into trips file
        inject_vehicle_type_to_trips(trips_path)

        # Step 2: Generate routes
        result2 = subprocess.run([
            "duarouter",
            "-n", net_path,
            "--route-files", trips_path,
            "-o", route_path
        ], check=True, capture_output=True, text=True)

    except subprocess.CalledProcessError as e:
        socketio.emit("error", {"message": "Failed to generate background traffic."})
        return None

    return route_path


def update_cfg_with_routes(cfg_file, route_files):
    tree = ET.parse(cfg_file)
    root = tree.getroot()

    input_element = root.find("input")
    if input_element is None:
        raise ValueError("No <input> element found in the config file")

    route_element = input_element.find("route-files")
    if route_element is None:
        raise ValueError("No <route-files> element found in the config file")

    route_element.set("value", ",".join(route_files))
    tree.write(cfg_file)

def sumo_simulation():
    global traffic_level
    if (traffic_level != "none"):
        print("Generating background traffic")
        # Determine traffic generation rate
        rate_map = {
            "low": {"binomial": 1, "period": 5},
            "medium": {"binomial": 3, "period": 3},
            "high": {"binomial": 6, "period": 2}
        }
        rate = rate_map.get(traffic_level, 3)

        # Generate traffic and update configuration
        background_route = generate_background_traffic(rate=rate)
        update_cfg_with_routes(SUMO_CFG_FILE, [
            "osm_pt.rou.xml",
            "background.rou.xml"
        ])

    # Start SUMO
    print('starting the sim!')
    traci.start([
    SUMO_BINARY,
    "-c", SUMO_CFG_FILE,
    "--start",
    "--error-log", "/tmp/sumo_errors.log"
])

    socketio.emit("simulationStarted")

    while traci.simulation.getMinExpectedNumber() > 0:
        # Pause mechanism
        with pause_condition:
            while paused:
                pause_condition.wait()

        traci.simulationStep()
        vehicles = []

        for vehicle_id in traci.vehicle.getIDList():
            vehicle_type = traci.vehicle.getTypeID(vehicle_id)
            position = traci.vehicle.getPosition(vehicle_id)
            gps_position = traci.simulation.convertGeo(*position)
            angle = traci.vehicle.getAngle(vehicle_id)
            vehicles.append({'id': vehicle_id, 'x': gps_position[0], 'y': gps_position[1], 'angle': angle, 'type': vehicle_type})

        socketio.emit('update', vehicles)
        time.sleep(0.00001)

    traci.close()
    socketio.emit("simulationEnded")

@socketio.on('setTrafficLevel')
def handle_set_traffic_level(data):
    global traffic_level
    level = data.get('level')
    if level in ['none', 'low', 'medium', 'high']:
        traffic_level = level
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

@socketio.on("stop")
def handle_stop():
    global paused
    paused = True
    try:
        traci.close()
    except traci.exceptions.FatalTraCIError:
        print("Tried to stop simulation, but TraCI was already closed.")
    socketio.emit("simulationEnded")

@app.route('/')

def index():
    return render_template('index.html', mapbox_token=MAPBOX_TOKEN)

if __name__ == "__main__":
    socketio.run(app, debug=True, use_reloader=False, host="0.0.0.0", port=8880, allow_unsafe_werkzeug=True)