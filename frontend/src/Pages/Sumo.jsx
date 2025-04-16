import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import "./Sumo.css";
import { SUMO_BASE_URL } from '@/constants'

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const socketRef = useRef(null);
    const [simulationStatus, setSimulationStatus] = useState('Play');

    useEffect(() => {
        socketRef.current = io(`${SUMO_BASE_URL}`);
    
        socketRef.current.on("simulationStarted", () => {
            setSimulationStatus("Playing");
        });
    
        socketRef.current.on("simulationEnded", () => {
            setSimulationStatus("Play");
        });
    
        return () => {
            socketRef.current.disconnect();
        };
    }, []);
    

    const handlePlay = () => {
        if (socketRef.current) {
            socketRef.current.emit("play");
            setSimulationStatus("Loading...");
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