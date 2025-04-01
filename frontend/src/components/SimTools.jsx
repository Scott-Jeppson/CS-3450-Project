import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import './simtools.css';

function SimTools() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const socketRef = useRef(null);

    // Connect to SUMO backend via Socket.IO (port 5000)
    useEffect(() => {
        socketRef.current = io('http://localhost:5000');

        socketRef.current.on('connect', () => {
            console.log('Connected to SUMO backend');
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
        // Later: emit speed change
    };

    const handlePlay = () => {
        setIsPlaying(true);
        if (socketRef.current && socketRef.current.connected) {
            socketRef.current.emit('play');
            console.log('Play event sent to SUMO backend');
        } else {
            console.warn('Socket not connected to SUMO backend');
        }
    };

    const handlePause = () => {
        setIsPlaying(false);
        // Later: emit pause
    };

    const handleReset = () => {
        // Later: emit reset/replay
    };

    return (
        <div className="sim-tools-container">
            <div className="control-buttons left">
                <button className="control-btn speed-btn" onClick={() => handleSpeedChange(0.5)} title="Run simulation at half speed">
                    0.5x
                </button>
                <button className="control-btn speed-btn" onClick={() => handleSpeedChange(1)} title="Run simulation at normal speed">
                    1.0x
                </button>
                <button className="control-btn speed-btn" onClick={() => handleSpeedChange(1.5)} title="Run simulation at 1.5x speed">
                    1.5x
                </button>
            </div>

            <Link to="" className="expand-btn" title="Expand simulation">
                Expand Simulation
            </Link>

            <div className="control-buttons right">
                <button className="control-btn" onClick={handleReset} title="Reset simulation">
                    <span className="material-symbols-outlined">refresh</span>
                </button>
                <button className="control-btn" onClick={handlePlay} title="Play simulation">
                    <span className="material-symbols-outlined">play_arrow</span>
                </button>
                <button className="control-btn" onClick={handlePause} title="Pause simulation">
                    <span className="material-symbols-outlined">pause</span>
                </button>
            </div>
        </div>
    );
}

export default SimTools;
