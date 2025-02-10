from quart import jsonify

async def register_test_routes(app):

    @app.route("/hello", methods=["GET"])
    async def users():
        try:
            return jsonify({"message": "Hello, World!"}), 200
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500