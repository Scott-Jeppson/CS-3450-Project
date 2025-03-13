import hashlib
import secrets
import asyncpg
from quart import jsonify, request, session, Blueprint
from quart_cors import cors


async def register_user_routes(app):
    app = cors(app)
    user_routes = Blueprint('user_routes',__name__)

    @user_routes.route("/api/createaccount", methods=["POST"])
    async def create_account():
        try:
            data = await request.get_json()
            first_name = data.get("user_first")
            last_name = data.get("user_last")
            email = data.get("user_email")
            password = data.get("user_password")

            if not all([first_name, last_name, email, password]):
                print("Missing required fields")
                return jsonify({"error": "Missing required fields"}), 400
            
            salt = secrets.token_hex(16)
            password_hash = hashlib.sha256((password + salt).encode()).hexdigest()

            try:
                async with app.db_pool.acquire() as conn:
                    await conn.execute('INSERT INTO user_information(first_name, last_name, email, password_hash, salt) VALUES($1, $2, $3, $4, $5)', first_name, last_name, email, password_hash, salt)
            except asyncpg.exceptions.UniqueViolationError:
                return jsonify({"error": "Account with this username already exists, please sign in."}), 400
            
            print("User registered successfully")
            return jsonify({"message": "User registered successfully"}), 201
        except Exception as e:
            # print(f"An error occurred: {str(e)}")
            # return jsonify({"error": f"An error occurred here: {str(e)}"}), 500
    
    @user_routes.route("/api/signin", methods=["POST"])
    async def sign_in():
        try:
            data = await request.get_json()
            email = data.get("user_email")
            password = data.get("user_password")

            if not all([email, password]):
                print("Missing required fields")
                return jsonify({"error": "Missing required fields"}), 400

            async with app.db_pool.acquire() as conn:
                salt_record = await conn.fetchrow('SELECT salt FROM user_information WHERE email = $1', email)
                if not salt_record:
                    print("User not found (missing salt)")
                    return jsonify({"error": "User not found"}), 404
                
                salt = salt_record['salt']
                password_hash = hashlib.sha256((password + salt).encode()).hexdigest()

                user = await conn.fetchrow('SELECT * FROM user_information WHERE email = $1 AND password_hash = $2', email, password_hash)
                if not user:
                    print("Invalid credentials")
                    return jsonify({"error": "Invalid credentials"}), 401

            session['user_id'] = user['id']
            session['email'] = user['email']
            # await session.save()

            print("User signed in successfully")
            return jsonify({"message": "User signed in successfully"}), 200
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    @user_routes.route("/api/protected", methods=["GET"])
    async def protected_route():
        if 'user_id' not in session:
            return jsonify({"error": "Unauthorized"}), 401
        
        return jsonify({"message": "This is a protected route"})

    @user_routes.route("/api/signout", methods=["POST"])
    async def sign_out():
        session.clear()
        
        return jsonify({"message": "User signed out successfully"}), 200
    app.register_blueprint(user_routes)