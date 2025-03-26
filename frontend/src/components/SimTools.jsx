import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './simtools.css';

function SimTools() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
        // Will connect to SUMO later
    };

    const handlePlay = () => {
        setIsPlaying(true);
        // Will connect to SUMO later
    };

    const handlePause = () => {
        setIsPlaying(false);
        // Will connect to SUMO later
    };

    const handleReset = () => {
        // Will connect to SUMO later
    };

    return (
        <div className="sim-tools-container">
            <div className="control-buttons left">
                <button className="control-btn speed-btn" onClick={() => handleSpeedChange(0.5)} aria-label="Run simulation at half speed" title="Run simulation at half speed">
                    0.5x
                </button>
                <button className="control-btn speed-btn" onClick={() => handleSpeedChange(1)} aria-label="Run simulation at normal speed" title="Run simulation at normal speed">
                    1.0x
                </button>
                <button className="control-btn speed-btn" onClick={() => handleSpeedChange(1.5)} aria-label="Run simulation at 1.5x speed" title="Run simulation at 1.5x speed">
                    1.5x
                </button>
            </div>
            
            <Link to="" className="expand-btn" aria-label="Expand simulation">
                Expand Simulation
            </Link>

            <div className="control-buttons right">
                <button className="control-btn" onClick={() => handlePlay()} aria-label="Reset simulation" title="Reset simulation">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
                <button className="control-btn" onClick={() => handlePlay()}  aria-label="Play simulation" title="Play simulation">
                    <span className="material-symbols-outlined">play_arrow</span>
                </button>
                <button className="control-btn" onClick={() => handlePause()} aria-label="Pause simulation" title="Pause simulation">
                    <span className="material-symbols-outlined">pause</span>
                </button>
            </div>
        </div>
    );
}

export default SimTools; 