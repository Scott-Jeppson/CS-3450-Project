# Frontend - TradrCharts Dashboard

This frontend application provides a responsive dashboard for visualizing traffic and public transit simulations powered by SUMO. Built using Reactjs,  it offers real-time updates, performance statistics, and emissions insights collected from the simulation backend.

## Overview

The frontend dashboard includes:

- Live Map of simulated routes and vehicle movements
- Emissions analytics panel (CO2, NOx, PMx, fuel usage)
- Speed and travel time statistics for buses
- Secure authentication and user-specific data display (via Firebase Auth)

## Development Environment

This project uses Vite for fast frontend development and hot module replacement.

## File Structure

```
/frontend/
├── public/                  # Static assets
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/               # Page-level views
│   ├── api.js               # API calls and Socket.IO handlers
│   ├── constants.js         # port config for deployment vs production
│   ├── App.tsx              # Main app entrypoint
│   ├── main.tsx             # Vite entry file
│   └── index.css            # Global styles with Tailwind CSS
├── .env                     # Environment variables
├── package.json             # Project metadata and scripts
├── index.html               # static page
├── package.json             # Project metadata and scripts
├── vite.config.js           # vite config
```

## Setup Instructions

1. docker compose up

2. if dependencies are not installed run the following inside the frontend container.
```bash
npm install
```

The application should be available at `http://localhost:5173` by default.

## Environment Variables

Create a `.env` file in the root of `/frontend` and copy over the contents of .env.example

## Communication

The frontend communicates with:

- The SUMO simulation service on port `80`
- The Quart backend API on port `8080`
