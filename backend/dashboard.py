import os
import asyncpg
import asyncio
import hypercorn.asyncio
from quart import Quart
from quart_cors import cors
from dotenv import load_dotenv
from hypercorn.config import Config

from routes.user_routes import register_user_routes
from routes.test_routes import register_test_routes

load_dotenv()

app_secret = os.getenv("APP_SECRET")

app = Quart(__name__)
app.secret_key = app_secret

app = cors(
    app,
    allow_origin=["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:8080"],
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
    return await asyncpg.create_pool(
        user='db_user',
        password='db_password',
        database='db_name',
        host='127.0.0.1'
    )

@app.before_serving
async def startup():
    app.db_pool = await create_db_pool()

    await register_test_routes(app)
    await register_user_routes(app)

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:8080"]
    asyncio.run(hypercorn.asyncio.serve(app, config))