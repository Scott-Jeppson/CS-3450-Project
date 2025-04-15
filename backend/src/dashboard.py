import hypercorn.asyncio
import asyncpg
import asyncio
import base64
import boto3
import json
import os
import xml.etree.ElementTree as ET
from hypercorn.config import Config
from botocore.exceptions import ClientError
from quart import Quart, jsonify
from quart_cors import cors
from dotenv import load_dotenv

from routes.trip_routes import register_trip_routes
from routes.user_routes import register_user_routes

load_dotenv()
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
secret_name = os.getenv("DB_SECRET_NAME")
region_name = os.getenv("AWS_REGION")

session = boto3.Session()

client = session.client(
    service_name='secretsmanager',
    region_name=region_name,
    aws_access_key_id=aws_access_key,
    aws_secret_access_key=aws_secret_key
)

app_secret = os.getenv("APP_SECRET")

app = Quart(__name__)
app.secret_key = app_secret

app = cors(
    app,
    allow_origin=["http://localhost:5173",
                  "http://localhost:8080",
                  "http://localhost:5000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Content-Type", 
        "Authorization", 
        "X-CSRF-TOKEN", 
        "Cookie", 
        "X-Requested-With",
        "mode",
        "Access-Control-Request-Headers",
        "Access-Control-Request-Method",
        "Origin",
        "Accept"
    ],
    expose_headers=[
        "Content-Type", 
        "Authorization", 
        "Set-Cookie",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Credentials"
    ],
)

app.config.update(
    SESSION_COOKIE_SECURE=False,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='Lax',
    CORS_SUPPORTS_CREDENTIALS=True
)

# parse the summary files and return the data as JSON
@app.route('/tripstats', methods=['GET'])
async def get_tripinfo():
    print("Fetching tripinfo.xml")
    tripinfo_path = "/shared/output/tripinfo.xml"
    summary_path = "/shared/output/summary.xml"
    emissions_path = "/shared/output/emissions.xml"

    results = {}

    # --- TRIPINFO FILTERED FOR BUSES ---
    if os.path.exists(tripinfo_path):
        try:
            tree = ET.parse(tripinfo_path)
            root = tree.getroot()
            trips = []
            total_duration = total_waiting = total_time_loss = total_stop_time = 0.0

            for trip in root.findall('tripinfo'):
                vehicle_id = trip.get("id", "")
                if "bus" not in vehicle_id:  # <-- Only process bus trips
                    continue

                try:
                    duration = float(trip.get("duration", 0))
                    waiting_time = float(trip.get("waitingTime", 0))
                    time_loss = float(trip.get("timeLoss", 0))
                    stop_time = float(trip.get("stopTime", 0))
                    depart_delay = float(trip.get("departDelay", 0))
                    route_length = float(trip.get("routeLength", 0))
                    waiting_count = int(trip.get("waitingCount", 0))

                    trips.append({
                        "id": vehicle_id,
                        "duration": duration,
                        "routeLength": route_length,
                        "waitingTime": waiting_time,
                        "waitingCount": waiting_count,
                        "stopTime": stop_time,
                        "timeLoss": time_loss,
                        "departDelay": depart_delay
                    })

                    total_duration += duration
                    total_waiting += waiting_time
                    total_time_loss += time_loss
                    total_stop_time += stop_time
                except Exception as e:
                    print(f"Trip parse error: {e}")

            num_trips = len(trips)
            results['tripinfo'] = {
                "summary": {
                    "averageDuration": total_duration / num_trips if num_trips else 0,
                    "averageWaitingTime": total_waiting / num_trips if num_trips else 0,
                    "averageTimeLoss": total_time_loss / num_trips if num_trips else 0,
                    "averageStopTime": total_stop_time / num_trips if num_trips else 0,
                    "totalTrips": num_trips
                },
                "trips": trips
            }
        except Exception as e:
            results['tripinfo'] = {"error": f"Parse error: {e}"}
    else:
        results['tripinfo'] = {"error": "tripinfo.xml not found"}

    # --- SUMMARY: Leave this section as-is if it's not vehicle-specific ---
    if os.path.exists(summary_path):
        try:
            tree = ET.parse(summary_path)
            root = tree.getroot()

            total_waiting_time = total_travel_time = total_speed = total_relative_speed = 0.0
            collisions = teleports = halting = stopped = 0
            count = 0
            start_time = end_time = None

            for step in root.findall('step'):
                try:
                    if count == 0:
                        start_time = float(step.get("time", 0))
                    end_time = float(step.get("time", 0))

                    total_waiting_time += float(step.get("meanWaitingTime", 0))
                    total_travel_time += float(step.get("meanTravelTime", 0))
                    total_speed += float(step.get("meanSpeed", 0))
                    total_relative_speed += float(step.get("meanSpeedRelative", 0))
                    collisions += int(step.get("collisions", 0))
                    teleports += int(step.get("teleports", 0))
                    halting += int(step.get("halting", 0))
                    stopped += int(step.get("stopped", 0))
                    count += 1
                except Exception as e:
                    print(f"Summary step parse error: {e}")

            results['summary'] = {
                "simulationTime": {
                    "start": start_time,
                    "end": end_time
                },
                "averages": {
                    "meanWaitingTime": total_waiting_time / count if count else 0,
                    "meanTravelTime": total_travel_time / count if count else 0,
                    "meanSpeed": total_speed / count if count else 0,
                    "meanSpeedRelative": total_relative_speed / count if count else 0
                },
                "incidents": {
                    "collisions": collisions,
                    "teleports": teleports,
                    "halting": halting,
                    "stopped": stopped
                }
            }
        except Exception as e:
            results['summary'] = {"error": f"summary.xml parse error: {e}"}
    else:
        results['summary'] = {"error": "summary.xml not found"}

    # --- EMISSIONS FILTERED FOR BUSES ---
    if os.path.exists(emissions_path):
        try:
            tree = ET.parse(emissions_path)
            root = tree.getroot()

            total_co2 = total_hc = total_pmx = total_nox = total_fuel = 0.0
            count = 0
            per_vehicle_emissions = {}

            for timestep in root.findall('timestep'):
                for vehicle in timestep.findall('vehicle'):
                    vid = vehicle.get("id", "")
                    if "bus" not in vid:  # <-- Only process buses
                        continue

                    co2 = float(vehicle.get("CO2", 0))
                    hc = float(vehicle.get("HC", 0))
                    pmx = float(vehicle.get("PMx", 0))
                    nox = float(vehicle.get("NOx", 0))
                    fuel = float(vehicle.get("fuel", 0))

                    if vid not in per_vehicle_emissions:
                        per_vehicle_emissions[vid] = {
                            "CO2": 0.0, "HC": 0.0, "PMx": 0.0,
                            "NOx": 0.0, "fuel": 0.0, "count": 0
                        }

                    per_vehicle_emissions[vid]["CO2"] += co2
                    per_vehicle_emissions[vid]["HC"] += hc
                    per_vehicle_emissions[vid]["PMx"] += pmx
                    per_vehicle_emissions[vid]["NOx"] += nox
                    per_vehicle_emissions[vid]["fuel"] += fuel
                    per_vehicle_emissions[vid]["count"] += 1

                    total_co2 += co2
                    total_hc += hc
                    total_pmx += pmx
                    total_nox += nox
                    total_fuel += fuel
                    count += 1

            for vid, data in per_vehicle_emissions.items():
                n = data["count"]
                data["averageCO2"] = data["CO2"] / n if n else 0
                data["averageHC"] = data["HC"] / n if n else 0
                data["averagePMx"] = data["PMx"] / n if n else 0
                data["averageNOx"] = data["NOx"] / n if n else 0
                data["averageFuel"] = data["fuel"] / n if n else 0

            results['emissions'] = {
                "totals": {
                    "averageCO2": total_co2 / count if count else 0,
                    "averageHC": total_hc / count if count else 0,
                    "averagePMx": total_pmx / count if count else 0,
                    "averageNOx": total_nox / count if count else 0,
                    "averageFuel": total_fuel / count if count else 0,
                    "totalVehiclesMeasured": count
                },
                "perVehicle": per_vehicle_emissions
            }
        except Exception as e:
            results['emissions'] = {"error": f"Parse error: {e}"}
    else:
        results['emissions'] = {"error": "emissions.xml not found"}

    return jsonify(results), 200




async def create_db_pool():
    retries = 3

    retry = retries

    while retry >= 0:
        try:
            try:
                response = client.get_secret_value(SecretId=secret_name)
            except ClientError as e:
                print(e)
            
            if 'SecretString' in response:
                secret = json.loads(response['SecretString'])
            else:
                decoded_binary_secret = base64.b64decode(response['SecretBinary'])
                secret = json.loads(decoded_binary_secret)
            
            db_user = secret['username']
            db_password = secret['password']
            db_host = secret.get('host', 'streamline-database.c1m8wacs089y.us-west-2.rds.amazonaws.com')
            db_port=secret.get('port', 5432)
            db_name = secret.get('name', 'streamline-data')

            return await asyncpg.create_pool(
                user=db_user,
                password=db_password,
                database=db_name,
                host=db_host,
                port=db_port)

        except Exception as e:
            print(f"Connection failed: {e}, {retry} attempts remaining.")
            await asyncio.sleep(10)
            retry-=1
    
    raise Exception(f"Database connection failed after {retries} attempts.")

@app.before_serving
async def startup():
    app.db_pool = await create_db_pool()

    await register_trip_routes(app)
    await register_user_routes(app)

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:8080"]
    asyncio.run(hypercorn.asyncio.serve(app, config))