# Smart Transit Optimizer

## Overview
The Smart Transit Optimizer is a **traffic simulation and optimization tool** designed to help traffic managers in Utah 
County analyze and improve traffic flow. Using real-time and historical traffic data, along with an AI-powered simulation
model, it allows users to:
- **Visualize** real-time traffic data through an interactive simulation.
- **Simulate** route changes and traffic light adjustments to assess their impact.
- **Analyze** historical traffic trends in a clear and concise format.
- **Optimize** traffic flow efficiency through data-driven decision-making.

## Table of Contents
1. [Tech Stack](#tech-stack)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Usage](#usage)

## Tech Stack
The Smart Transit Optimizer is built with the following technologies:
- **Frontend:** React.js
- **Backend:** Quart
- **Database:** PostgreSQL
- **Simulation:** SUMO
- **Containerization:** Docker

## Architecture
The Smart Transit Optimizer is built using a microservices architecture to ensure scalability, flexibility, and 
maintainability. This approach is ideal for the project because it involves multiple distinct components that need to
function both independently and cohesively. By leveraging microservices, each component can be developed, deployed, and
maintained independently, which leads to greater modularity and flexibility in the overall system.

#### Key Components:
- **Frontend:** Presents real-time traffic data through the simulation, displays an analysis of historical traffic data,
and handles user interactions.
- **Backend:** Processes traffic data, facilitates communication between the frontend and other services, handles API
communication, and manages database interactions.
- **Database:** Stores critical data for the system such as route configurations, simulations results, etc.
- **Simulation:** Runs traffic flow simulations based on real-time input data and proposed route changes.

## Features

### Priority 1 - Mission Critical Features
- Interactive traffic simulation of real-time data
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

### Access the Dashboard
- Open the dashboard in your browser: ``` insert link later```

### Run a Traffic Simulation
``` insert instructions later```

### View Historical Data
``` insert instructions later```