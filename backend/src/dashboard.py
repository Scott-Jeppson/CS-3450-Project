import os
import asyncpg
import asyncio
import hypercorn.asyncio
from quart import Quart, jsonify
from quart_cors import cors
from dotenv import load_dotenv
from hypercorn.config import Config

from routes.user_routes import register_user_routes
from routes.test_routes import register_test_routes

load_dotenv()
POSTGRES_USER = os.getenv("POSTGRES_USER")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD")
POSTGRES_DB = os.getenv("POSTGRES_DB")

app_secret = os.getenv("APP_SECRET")

app = Quart(__name__)
app.secret_key = app_secret

app = cors(
    app,
    allow_origin=["http://localhost:5432", "http://localhost:5173", "http://localhost:8080"],
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

async def create_db_pool():
    retry = 3
    while retry>=0:
        try:
            return await asyncpg.create_pool(
                user=POSTGRES_USER,
                password=POSTGRES_PASSWORD,
                database=POSTGRES_DB,
                host='database',
                port=5432)
        except Exception as e:
            print(f"Connection failed: {e}, {retry} attempts remaining.")
            await asyncio.sleep(10)
            retry-=1
    raise Exception(f"Database connection failed after {retry+1} attempts.")

@app.before_serving
async def startup():
    app.db_pool = await create_db_pool()

    #await register_test_routes(app)
    await register_user_routes(app)

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:8080"]
    asyncio.run(hypercorn.asyncio.serve(app, config))