import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import Navbar from "../components/navbar.jsx";
import "./Sumo.css";
import { SUMO_BASE_URL } from '@/constants'

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(`${SUMO_BASE_URL}`);
        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)", overflowY: "auto" }}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div id="main-content">
                {isLoggedIn ? (
                    <>
                        <div className="sumo-header-row">
                            <button className="back-button" onClick={() => navigate("/dashboard")}>
                                ← Back
                            </button>
                            <div className="sumo-header">SUMO Simulation</div>
                        </div>

                        <div className="sumo-fullscreen-container">
                            <iframe
                                className="sumo-fullscreen-iframe"
                                src={`${SUMO_BASE_URL}/`}
                                title="SUMO Simulation"
                                allowFullScreen
                            />
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
