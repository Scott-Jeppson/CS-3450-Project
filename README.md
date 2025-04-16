# Smart Transit Optimizer

## Overview
The StreamLine Smart Transit Optimizer is a **traffic simulation and optimization tool** designed to help traffic managers in Utah 
County analyze and improve traffic flow. Using traffic data, along with an AI-powered simulation
model, it allows users to:
- **Visualize** traffic data through an interactive simulation.
- **Simulate** route changes and traffic light adjustments to assess their impact.
- **Analyze** historical traffic trends in a clear and concise format.
- **Optimize** traffic flow efficiency through data-driven decision-making.

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Usage](#usage)

## Tech Stack
The StreamLine Smart Transit Optimizer is built with the following technologies:
- **Frontend:** React.js
- **Backend:** Quart
- **Database:** PostgreSQL
- **Simulation:** SUMO
- **Containerization:** Docker
- **Optimization:** Ray (RLlib)

## Architecture
The StreamLine Smart Transit Optimizer is built using a microservices architecture to ensure scalability, flexibility, and 
maintainability. This approach is ideal for the project because it involves multiple distinct components that need to
function both independently and cohesively. By leveraging microservices, each component can be developed, deployed, and
maintained independently, which leads to greater modularity and flexibility in the overall system.

#### Key Components:
- **Frontend:** Presents real-time traffic data through the simulation, displays an analysis of historical traffic data,
and handles user interactions.
- **Backend:** Processes traffic data, facilitates communication between the frontend and other services, handles API
communication, and manages database interactions.
- **Database:** Stores critical data for the system such as route configurations, simulations results, etc.
	- We will use two databases, one that comes form the Utah Valley transit authority through an API. We won't be
		able to edit this database, so a secondary one exists to store any data that the program
		will create that we want to keep track of (logs, past simulation results, user data).
- **Simulation:** Runs traffic flow simulations based on real-time input data and proposed route changes.

## Features

### Priority 1 - Mission Critical Features
- Interactive traffic simulation
- Data processing for the simulation
- API connections

### Priority 2 - Important but Non-Critical Features
- Historical traffic data
- Traffic demand and congestion projection model

### Priority 3 - Nice to Have Features
- Traffic route and light optimization AI model
- Adaptive traffic patterns for emergency response vehicles
- Trouble ticket system

## Usage

### Enter Homepage
- To access the home page in the browser: [Home](http://localhost:5173/)

### Access the Dashboard
- Open the dashboard in your browser: [Dashboard](http://localhost:5173/dashboard)

### Run a Traffic Simulation
- User must create an account or signin then they will be redirected to the dashboard where the simulation will be accessible.

### View Historical Data
``` insert instructions later```

### Running Server
- To run the containerized server, an .env file must be present in the backend folder.
- This will include IAM user access key with permissions to automatically get database credentials from a remote database.
- Without these credentials there will not be any functionality because the server will not have database permissions.
