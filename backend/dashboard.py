import os
from quart import Quart
from quart_cors import cors
from dotenv import load_dotenv

from routes.user_routes import register_user_routes

load_dotenv()

app_secret = os.getenv("APP_SECRET")

app = Quart(__name__)
app = cors(
    app,
    allow_origin=["http://127.0.0.1:5173", "http://localhost:5173", "http://127.0.0.1:5000"],
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
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_DOMAIN=None,
    CORS_SUPPORTS_CREDENTIALS=True
)

async def register_routes():
    await register_user_routes(app)

if __name__ == '__main__':
    app.before_serving(register_routes)
    app.run(host="127.0.0.1", port=5000, debug=True)