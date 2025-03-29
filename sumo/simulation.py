from quart import Quart, render_template, websocket
import traci
import asyncio
import threading

app = Quart(__name__)
app.config['SECRET_KEY'] = 'A34F6g7JK0c5N'

<<<<<<< HEAD
# Configurations
SUMO_BINARY = "sumo"  # or "sumo-gui" for the GUI version
SUMO_CFG_FILE = "OremConfig/osm.sumocfg" # path to sumo config file
=======
SUMO_BINARY = "sumo" # or "sumo-gui" for the GUI version
SUMO_CFG_FILE = "sumo_config/osm.sumocfg" # path to sumo config file
>>>>>>> dev

def sumo_simulation():
    # Start SUMO simulation
    traci.start([SUMO_BINARY, "-c", SUMO_CFG_FILE, "--start"])

    while traci.simulation.getMinExpectedNumber() > 0:
        traci.simulationStep()
        vehicles = []

        for vehicle_id in traci.vehicle.getIDList():
            position = traci.vehicle.getPosition(vehicle_id)
            gps_position = traci.simulation.convertGeo(*position)
            angle = traci.vehicle.getAngle(vehicle_id)  # Vehicle orientation in degrees
            vehicles.append({'id': vehicle_id, 'x': gps_position[0], 'y': gps_position[1], 'angle': angle})

            # Animate each vehicle as they appear one by one
            socketio.emit('update', vehicles)
            time.sleep(0.01)  # Emit every second. Adjust here to reduce the overall vehicle speed.

        # Animate all in one shot
        socketio.emit('update', vehicles)
        time.sleep(0.01)  # Emit every second. Adjust here to reduce the overall vehicle speed.

    traci.close()

async def send_update(vehicles):
    await websocket.send_json(vehicles)

@app.websocket('/ws')
async def ws():
    if not sumo_thread.is_alive():
        sumo_thread.start()

    while True:
        await websocket.receive()

@app.route('/')
async def index():
    return await render_template('index.html', mapbox_token="pk.eyJ1IjoiY2FtY290dGxlIiwiYSI6ImNtN2dscjZsbjBjcnEyc3B0cjd2NG5hdnAifQ.q2giKiZ15tBz3DXiBq3xew")

if __name__ == "__main__":
    sumo_thread = threading.Thread(target=sumo_simulation)
    app.run(debug=True, host="0.0.0.0")