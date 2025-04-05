import hypercorn.asyncio
import asyncpg
import asyncio
import base64
import boto3
import json
import os
from hypercorn.config import Config
from botocore.exceptions import ClientError
from quart import Quart
from quart_cors import cors
from dotenv import load_dotenv

from routes.user_routes import register_user_routes
from routes.test_routes import register_test_routes

load_dotenv()
aws_access_key = os.getenv("AWS_ACCESS_KEY_ID")
aws_secret_key = os.getenv("AWS_SECRET_ACCESS_KEY")
secret_name=os.getenv("DB_SECRET_NAME")
region_name=os.getenv("AWS_REGION")

session = boto3.session.Session()

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
    allow_origin=["http://localhost:5173", "http://localhost:8080"],
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

# example of reading the tripinfo.xml file. the other file is called summary.xml
@app.route('/tripstats', methods=['GET'])
async def get_tripinfo():
    print("Fetching tripinfo.xml")
    # these file only exist after a simulation is run.
    tripinfo_path = "/shared/output/tripinfo.xml"
    if os.path.exists(tripinfo_path):
        try:
            with open(tripinfo_path, "r") as f:
                content = f.read()
            print(content)
            return {}, 200
        except Exception as e:
            return {"error": str(e)}, 500
    else:
        return {"error": "File not found"}, 404

async def create_db_pool():
    retries = 3
    retry = retries
    while retry>=0:
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

    #await register_test_routes(app)
    await register_user_routes(app)

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:8080"]
    asyncio.run(hypercorn.asyncio.serve(app, config))