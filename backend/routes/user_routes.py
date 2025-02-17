from quart import jsonify, request
import asyncpg

USERS = ["Alice", "Bob", "Charlie", "David", "Eve"]

async def register_user_routes(app):

    @app.route("/createaccount", methods=["POST"])
    async def create_account():
        try:
            data = await request.get_json()
            first_name = data.get("first_name")
            last_name = data.get("last_name")
            email = data.get("email")
            password = data.get("password")

            if not all([first_name, last_name, email, password]):
                return jsonify({"error": "Missing required fields"}), 400

            conn = await asyncpg.connect(user='db_user', password='db_password',
                                         database='db_name', host='127.0.0.1')
            await conn.execute('''
                INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)
            ''', first_name, last_name, email, password)
            await conn.close()

            return jsonify({"message": "User registered successfully"}), 201
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
        