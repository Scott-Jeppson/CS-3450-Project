import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getTripStats } from '../api.js';
import './simtools.css';

function SimTools({ setStats }) {
    const [simulationStatus, setSimulationStatus] = useState('Stopped');
    const [trafficLevel, setTrafficLevel] = useState('none');
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:5000");
    
        // Immediately sync traffic level
        socketRef.current.emit("setTrafficLevel", { level: trafficLevel });
    
        socketRef.current.on("simulationStarted", () => setSimulationStatus("Playing"));
        socketRef.current.on("simulationEnded", async () => {
            setSimulationStatus("Stopped");
            try {
                const data = await getTripStats();
                console.log("Fetched trip stats after sim ended:", data);
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch trip stats:", err);
            }
        });
        socketRef.current.on("paused", () => setSimulationStatus("Paused"));
        socketRef.current.on("resumed", () => setSimulationStatus("Playing"));
    
        return () => {
            socketRef.current.disconnect();
        };
    }, [setStats]);
    

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
        if (socketRef.current) {
            socketRef.current.emit("stop");
            setSimulationStatus("Stopped");
            setStats(null);
        }
    };

    const handleTrafficLevelChange = (e) => {
        const level = e.target.value;
        setTrafficLevel(level);
        if (socketRef.current) {
            socketRef.current.emit("setTrafficLevel", { level });
        }
    };

    const renderPlayPauseIcon = () => {
        if (simulationStatus === "Playing") return "pause";
        if (simulationStatus === "Paused" || simulationStatus === "Stopped") return "play_arrow";
        return "hourglass_empty";
    };

    return (
        <div className="sim-tools-container">
            <div className="traffic-level-selector">
                <label htmlFor="trafficLevel">Traffic:</label>
                <select
                    id="trafficLevel"
                    disabled={simulationStatus !== 'Stopped'}
                    onChange={handleTrafficLevelChange}
                    value={trafficLevel}
                >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                {trafficLevel !== "none" && (
        <div className="traffic-tip">
            Higher traffic levels will increase simulation loading times.
        </div>
    )}
            </div>

            <div className="control-buttons">
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