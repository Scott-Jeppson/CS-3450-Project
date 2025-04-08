import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import './simtools.css';

function SimTools() {
    const [simulationStatus, setSimulationStatus] = useState('Stopped'); // 'Stopped' | 'Playing' | 'Paused'
    const [speed, setSpeed] = useState(1);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:5000");

        socketRef.current.on("simulationStarted", () => {
            setSimulationStatus("Playing");
        });

        socketRef.current.on("simulationEnded", () => {
            setSimulationStatus("Stopped");
        });

        socketRef.current.on("paused", () => {
            setSimulationStatus("Paused");
        });

        socketRef.current.on("resumed", () => {
            setSimulationStatus("Playing");
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handleSpeedChange = (newSpeed) => {
        setSpeed(newSpeed);
        // TODO: emit speed change
    };

    const handleTogglePlayPause = () => {
        if (!socketRef.current) return;

        if (simulationStatus === "Playing") {
            socketRef.current.emit("pause");
            setSimulationStatus("Loading...");
        } else if (simulationStatus === "Paused" || simulationStatus === "Stopped") {
            socketRef.current.emit("play");
            setSimulationStatus("Loading...");
        }
    };

    const handleReset = () => {
        // TODO: emit reset/replay
    };

    const renderPlayPauseIcon = () => {
        if (simulationStatus === "Playing") return "pause";
        if (simulationStatus === "Paused" || simulationStatus === "Stopped") return "play_arrow";
        return "hourglass_empty"; // Loading
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

                <button className="control-btn" onClick={handleTogglePlayPause} title={simulationStatus === "Playing" ? "Pause" : "Play"}>
                    <span className="material-symbols-outlined">{renderPlayPauseIcon()}</span>
                </button>
            </div>
        </div>
    );
}

export default SimTools;
