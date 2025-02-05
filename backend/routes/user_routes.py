from quart import jsonify

USERS = ["Alice", "Bob", "Charlie", "David", "Eve"]

async def register_user_routes(app):

    @app.route("/users", methods=["GET"])
    async def users():
        try:
            return jsonify({"users": len(USERS)}), 200
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500