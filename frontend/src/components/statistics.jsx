import './statistics.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";

function Statistics({ isLoggedIn, setIsLoggedIn }) {

    return (
        <>
            <h1>Statistics</h1>

            <div className="stats-box">
                <div className="stats-item">10%</div>
                <div className="stats-item">20%</div>
                <div className="stats-item">30%</div>
                <div className="stats-item">40%</div>
                <div className="stats-item">50%</div>
                <div className="stats-item">60%</div>
                <div className="stats-item">70%</div>
                <div className="stats-item">80%</div>
                <div className="stats-item">90%</div>
                <div className="stats-item">100%</div>
                <div className="stats-item">110%</div>
                <div className="stats-item">120%</div>
                <div className="stats-item">130%</div>
                <div className="stats-item">140%</div>
                <div className="stats-item">150%</div>
                <div className="stats-item">160%</div>
            </div>
        </>
    );
}

export default Statistics;