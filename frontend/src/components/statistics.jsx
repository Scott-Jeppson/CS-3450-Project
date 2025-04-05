import './statistics.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";
import { getTripStats } from '../api.js';

function Statistics({ isLoggedIn, setIsLoggedIn }) {

    const fetchStats = async () => {
        const tripStats = await getTripStats();
    };

    return (
        <>
            <h1>Statistics</h1>
            <button onClick={fetchStats}>Fetch Trip Stats</button>
            <div className="stats-box" role="list">
                <div className="stats-item" role="listitem">
                    <b> THESE ARE JUST PLACEHOLDERS FOR NOW: </b> :)))
                </div>
                <div className="stats-item" role="listitem">
                    <b> Number of Routes: </b> 100
                </div>
                <div className="stats-item" role="listitem">
                    <b> Number of Stops: </b> 1000
                </div>
                <div className="stats-item" role="listitem">
                    <b> Average Passenger Wait Time: </b> 15
                </div>
                <div className="stats-item" role="listitem">
                    <b> Average Passenger Travel Time: </b> 20
                </div>
                <div className="stats-item" role="listitem">
                    <b> Average Boardings Per Route: </b> 1.1
                </div>
                <div className="stats-item" role="listitem">
                    <b> Roads Traveled By Multiple Buses: </b> 58
                </div>
                <div className="stats-item" role="listitem">
                    <b> Highest Passenger Average For One Route: </b> 843
                </div>
                <div className="stats-item" role="listitem">
                    <b> Lowest Passenger Average For One Route: </b> 23
                </div>
                <div className="stats-item" role="listitem">
                    <b> Longest Route in Miles: </b> 45.6
                </div>
                <div className="stats-item" role="listitem">
                    <b> Lowest Route in Miles: </b> 13.4
                </div>
                <div className="stats-item" role="listitem">
                    <b> Average Traffic Light Wait Time: </b> 3.5
                </div>
                <div className="stats-item" role="listitem">
                    <b> Average Bus Speed: </b> 21
                </div>
                <div className="stats-item" role="listitem">
                    <b> Number of Routes Through School Zones: </b> 25
                </div>
                <div className="stats-item" role="listitem">
                    <b> City With The Most Routes: </b> Salt Lake
                </div>
                <div className="stats-item" role="listitem">
                    <b> City With The Least Routes: </b> Murray
                </div>
            </div>
        </>
    );
}

export default Statistics;