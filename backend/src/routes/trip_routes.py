import os

async def register_trip_routes(app):

    @app.route('/tripstats', methods=['GET'])
    async def get_tripinfo():
        print("Fetching tripinfo.xml")
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