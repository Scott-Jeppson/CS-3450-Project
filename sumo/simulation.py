import xml.etree.ElementTree as ET
import subprocess
import socketio
import traci
import asyncio
import os
import sys
from quart import Quart, render_template
from hypercorn.config import Config
from hypercorn.asyncio import serve
from dotenv import load_dotenv

sys.stdout.reconfigure(line_buffering=True)
sys.stderr.reconfigure(line_buffering=True)

os.environ['SUMO_HOME'] = "/usr/share/sumo"

load_dotenv()

MAPBOX_TOKEN = os.getenv("MAPBOX_TOKEN")

app = Quart(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'A34F6g7JK0c5N'
sio = socketio.AsyncServer(async_mode='quart', cors_allowed_origins="*")
sio.init_app(app)

asgi_app = socketio.ASGIApp(sio, app)

SUMO_BINARY = "sumo"
SUMO_CFG_FILE = "OremConfig/osm.sumocfg"

output_dir = "/shared/output"
output_files = ["summary.xml", "tripinfo.xml", "emmisions.xml"]

paused = False
pause_condition = asyncio.Condition()
traffic_level = "medium"
sumo_task: asyncio.Task | None = None

os.makedirs(output_dir, exist_ok=True)
for fname in output_files:
    full_path = os.path.join(output_dir, fname)
    if not os.path.exists(full_path):
        with open(full_path, "w") as f:
            f.write("")

def inject_vehicle_type_to_trips_sync(trips_file: str) -> None:
    with open(trips_file, "r") as f:
        lines = f.readlines()
    for i, line in enumerate(lines):
        if "<routes" in line:
            lines.insert(
                i + 1,
                '    <vType id="car" accel="2.0" decel="4.5" sigma="0.5" '
                'length="5.0" minGap="2.5" maxSpeed="25" guiShape="passenger"/>\n'
            )
            break
    with open(trips_file, "w") as f:
        f.writelines(lines)

def generate_background_traffic_sync(rate: dict) -> str | None:
    base = "/sumo/OremConfig"
    net = os.path.join(base, "osm.net.xml.gz")
    trips = os.path.join(base, "background.trips.xml")
    rou = os.path.join(base, "background.rou.xml")

    for p in (trips, rou):
        if os.path.exists(p):
            os.remove(p)

    try:
        subprocess.run([
            "python3", "/usr/local/share/sumo/tools/randomTrips.py",
            "-n", net,
            "-o", trips,
            "--seed", "42",
            "--trip-attributes", 'type="car"',
            "--binomial", str(rate.get("binomial", 3)),
            "--prefix", "car",
            "--begin", "0",
            "--end", "3600",
            "--period", str(rate.get("period", 3))
        ], check=True, capture_output=True, text=True)

        inject_vehicle_type_to_trips_sync(trips)

        subprocess.run([
            "duarouter",
            "-n", net,
            "--route-files", trips,
            "-o", rou
        ], check=True, capture_output=True, text=True)

    except subprocess.CalledProcessError:
        asyncio.create_task(sio.emit("error", {"message": "Failed to generate background traffic."}))
        return None

    return rou

def update_cfg_with_routes_sync(cfg_file: str, route_files: list[str]) -> None:
    tree = ET.parse(cfg_file)
    root = tree.getroot()
    inp = root.find("input")
    if inp is None:
        raise ValueError("No <input> element found in the config file")
    rf = inp.find("route-files")
    if rf is None:
        raise ValueError("No <route-files> element found in the config file")
    rf.set("value", ",".join(route_files))
    tree.write(cfg_file)

async def generate_background_traffic(rate: dict) -> str | None:
    return await asyncio.to_thread(generate_background_traffic_sync, rate)

async def update_cfg_with_routes(cfg: str, routes: list[str]) -> None:
    await asyncio.to_thread(update_cfg_with_routes_sync, cfg, routes)

async def sumo_simulation() -> None:
    global traffic_level

    if traffic_level != "none":
        print("Generating background traffic")
        rate_map = {
            "low":    {"binomial": 1, "period": 5},
            "medium": {"binomial": 3, "period": 3},
            "high":   {"binomial": 6, "period": 2}
        }
        rate = rate_map.get(traffic_level, {})
        bg_route = await generate_background_traffic(rate)
        if bg_route:
            await update_cfg_with_routes(SUMO_CFG_FILE, ["osm_pt.rou.xml", bg_route])

    print("starting the sim!")
    await asyncio.to_thread(
        traci.start,
        [SUMO_BINARY, "-c", SUMO_CFG_FILE, "--start", "--error-log", "/tmp/sumo_errors.log"]
    )
    await sio.emit("simulationStarted")

    while await asyncio.to_thread(traci.simulation.getMinExpectedNumber) > 0:
        async with pause_condition:
            while paused:
                await pause_condition.wait()

        await asyncio.to_thread(traci.simulationStep)
        ids = await asyncio.to_thread(traci.vehicle.getIDList)

        vehicles = []
        for vid in ids:
            vtype = await asyncio.to_thread(traci.vehicle.getTypeID, vid)
            pos = await asyncio.to_thread(traci.vehicle.getPosition, vid)
            gps = await asyncio.to_thread(traci.simulation.convertGeo, *pos)
            ang = await asyncio.to_thread(traci.vehicle.getAngle, vid)
            vehicles.append({
                "id": vid,
                "x": gps[0],
                "y": gps[1],
                "angle": ang,
                "type": vtype
            })

        await sio.emit("update", vehicles)
        await asyncio.sleep(1e-5)

    await asyncio.to_thread(traci.close)
    await sio.emit("simulationEnded")

@sio.on("setTrafficLevel")
async def handle_set_traffic_level(data):
    global traffic_level
    lvl = data.get("level")
    if lvl in ("none", "low", "medium", "high"):
        traffic_level = lvl
        await sio.emit("trafficLevelConfirmed", {"level": lvl})
    else:
        await sio.emit("error", {"message": "Invalid traffic level"})


@sio.on("play")
async def handle_play():
    global sumo_task, paused
    if sumo_task is None or sumo_task.done():
        sumo_task = asyncio.create_task(sumo_simulation())
    else:
        async with pause_condition:
            paused = False
            pause_condition.notify_all()
        await sio.emit("resumed")

@sio.on("pause")
async def handle_pause():
    global paused
    async with pause_condition:
        paused = True
    await sio.emit("paused")

@sio.on("stop")
async def handle_stop():
    global paused
    paused = True
    try:
        await asyncio.to_thread(traci.close)
    except traci.exceptions.FatalTraCIError:
        print("Tried to stop simulation, but TraCI was already closed.")
    await sio.emit("simulationEnded")

@app.route("/")
async def index():
    return await render_template("index.html", mapbox_token=MAPBOX_TOKEN)

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:8081"]
    config.use_reloader = False

    asyncio.run(serve(asgi_app, config))