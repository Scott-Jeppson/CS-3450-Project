import asyncio
from quart import Quart, jsonify
from hypercorn.asyncio import serve
from hypercorn.config import Config

app = Quart(__name__)

@app.route('/test', methods=['GET'])
async def test():
    return jsonify({"message": "Test endpoint is working"}), 200

if __name__ == "__main__":
    config = Config()
    config.bind = ["0.0.0.0:25578"]
    
    asyncio.run(serve(app, config))