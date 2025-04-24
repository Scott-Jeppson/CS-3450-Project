# SUMO Container - Traffic Simulation Service

This container runs the SUMO (Simulation of Urban MObility) engine to simulate traffic patterns and public transit operations in Utah County. It serves as a backend service for the TradrCharts traffic optimization platform, enabling real-time traffic analysis, emissions tracking, and transit performance monitoring.

## Overview

The SUMO container provides:

- Integration with OpenStreetMap and GTFS data
- Emissions and performance tracking (CO2, NOx, PMx, fuel consumption, speed, etc.)
- Preconfigured simulation of bus routes (e.g., Route 862 in Orem)
- Support for real-time communication with the backend via Flask-SocketIO

## Container Details

| Name         | Port | Description                                      |
|--------------|------|--------------------------------------------------|
| sumo-server  | 80   | Handles SUMO simulation and emits live statistics|

## File Structure

```
/sumo/OremConfig    # contains all the information regaurding the simulation such as route definitions, bus stops, and network configuration.
/sumo/static        # contains image icons, js for route tools, and css for styling on the map
/templates          # html page for the map
simulation.py       # serves the simulation on port 80
```

## Setup Instructions

1. Build and start the container using Docker Compose:

```bash
docker compose up --build sumo-server
```

2. Ensure the frontend and backend services are also running to enable full integration.

## Environment Variables

You can configure the following variables in your `.env` or Docker Compose file if needed:

- `SIM_DURATION`: Total number of simulation steps (default: 3600)
- `NET_FILE`: Path to the SUMO network file
- `ROUTE_FILE`: Path to the route XML file

## Output Files

The container will generate the following output files:

- `tripinfo.xml`: Contains trip duration, waiting time, and other performance metrics
- `emissions.xml`: Reports CO2, NOx, PMx, fuel consumption per vehicle

These files can be parsed by the backend and visualized on the frontend dashboard.

## Communication

The SUMO container emits real-time statistics over port `5000` using SocketIO. Make sure your backend is listening for these events to log and forward the data to the frontend.

## Maintenance

To reset the simulation or rerun with new parameters:

1. Modify the `osm.sumocfg` and related XML files as needed.
2. Rebuild the container:

```bash
docker compose up --build
```
