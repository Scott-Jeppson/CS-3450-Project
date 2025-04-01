import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import "./Sumo.css";


const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false); // 🔹 NEW STATE

    useEffect(() => {
        socketRef.current = io("http://localhost:5000");

        // Optional: Listen for server confirmation (if needed)
        socketRef.current.on("simulationStarted", () => {
            setIsPlaying(true);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const handlePlay = () => {
        if (socketRef.current && !isPlaying) {
            socketRef.current.emit("play");
            setIsPlaying(true); // 🔹 Assume it's playing unless server tells us otherwise
        }
    };

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)", overflowY: "auto" }}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div id="main-content">
                {isLoggedIn ? (
                    <>
                        <div className="sumo-header">SUMO Simulation</div>
                        <div className="sumo-container">
                            <button
                                onClick={handlePlay}
                                className="play-button"
                                disabled={isPlaying}
                            >
                                {isPlaying ? "Playing..." : "Play"}
                            </button>
                            <SumoSim />
                        </div>
                    </>
                ) : (
                    <h1>You are not logged in</h1>
                )}
            </div>
        </div>
    );
};

export default Dashboard;