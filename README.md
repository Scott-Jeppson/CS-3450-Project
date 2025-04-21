# Smart Transit Optimizer

## Overview
The StreamLine Transit Optimizer is a **traffic visualization and analysis tool** built to assist Utah County transit managers
in understanding and improving public bus transit systems. Using real-world data, users can:
- **Visualize** active bus routes, stops, and traffic patterns across Utah County.
- **Analyze** route performance and efficiency using clear, accessible statistics.
- **Plan** a more efficient transit system through StreamLine provided, data-driven decision-making.

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Usage](#usage)

## Tech Stack
The StreamLine Smart Transit Optimizer is built with the following technologies:
- **Frontend:** React.js (hosted on Cloudflare)
- **Backend:** Quart (hosted on USU server)
- **Database:** PostgreSWL (hosted on AWS)
- **Simulation:** SUMO (Simulation of Urban Mobility)
- **Containerization:** Docker

## Architecture
The StreamLine Smart Transit Optimizer is built using a microservices architecture to ensure scalability, flexibility, and
maintainability. This approach is ideal for the project because it involves multiple distinct components that need to
function both independently and cohesively. By leveraging microservices, each component can be developed, deployed, and
maintained independently, which leads to greater modularity and flexibility in the overall system.

#### Key Components:
- **Frontend:** Presents real-world transit data through the simulation, displays an analysis of the transit data,
  and handles user interactions.
- **Backend:** Serves SUMO data to the frontend, manages user sessions, communicates with the servers.
- **Database:** Stores authentication data.
- **Simulation:** Runs traffic flow simulations based on real-world input data.

## MVP Features

### Priority 1 - Mission Critical Features
- Visual map of Utah County that shows real-world data on bus routes, bus stops, and bus positions relative to each other.
- Integration of real-world transit data directly into SUMO.

### Priority 2 - Important but Non-Critical Features
- Bus data processing that presents transit managers with clear, accessible statistics on route performance and efficiency.
- User authentication and session management.

### Priority 3 - Nice to Have Features
- Traffic route optimization AI model
- Passenger demand prediction AI model

## Usage

### Accessing the Application
- To access the website via Docker:
	- Run `docker compose up --build` in the root directory of the project.
	- Navigate to `localhost:5173` in your web browser.
- To access the website via Cloudfare:
	- Navigate to [StreamLine](https://streamlined.pages.dev/) in your web browser.

### Access the Dashboard
- On the home page, click on `Create Account` or `Sign In` to access the dashboard.
- Once logged in, you will be redirected to the dashboard where you can view the simulation map.

### Run a Traffic Simulation
- While on the dashboard, click the play icon on the bottom right of the simulation map.
- Wait for up to 30 seconds for the simulation to load.
- Once the simulation is loaded, you will see buses moving along their routes on the map.

### View Route Data
- Run the simulation as described above.
- Once the simulation has completely ended, the statistics will pop up below the simulation map.
- A dark purple box contains the overall statistics for the simulation.
- The lighter purple box contain statistics for each bus route.

### Running via Docker Notes
- To run the containerized server, an .env file must be present in the backend folder containing the database credentials, the SUMO credentials, and
  the Mapbox API key.
