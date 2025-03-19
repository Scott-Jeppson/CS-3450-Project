import os
import sys
import threading
import traci
import json
from flask import Flask, render_template
from flask_socketio import SocketIO

# Setup Flask app
app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# SUMO Configuration File
SUMO_CFG_FILE = "orem.sumocfg"  # Ensure this file exists and is correctly set up

# Global variable to track the SUMO simulation thread
sumo_thread = None

@app.route('/')
def index():
    """Render the index.html page."""
    return render_template('index.html')

def sumo_simulation():
    """Run SUMO in a separate thread and send vehicle positions via WebSocket."""
    sumo_cmd = ["sumo", "-c", SUMO_CFG_FILE]  # Use "sumo" instead of "sumo-gui" for non-GUI mode
    traci.start(sumo_cmd)

    while True:
        traci.simulationStep()
        vehicles = []

        for vehicle_id in traci.vehicle.getIDList():
            if "bus" in vehicle_id:  # Filters only buses
                position = traci.vehicle.getPosition(vehicle_id)
                gps_position = traci.simulation.convertGeo(*position)  # Converts SUMO position to real-world GPS
                angle = traci.vehicle.getAngle(vehicle_id)
                vehicles.append({'id': vehicle_id, 'x': gps_position[0], 'y': gps_position[1], 'angle': angle})

        socketio.emit('vehicle_update', json.dumps(vehicles))

    traci.close()

@socketio.on('connect')
def handle_connect():
    """Start SUMO simulation when a user connects."""
    global sumo_thread
    if sumo_thread is None or not sumo_thread.is_alive():
        sumo_thread = threading.Thread(target=sumo_simulation)
        sumo_thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True)
