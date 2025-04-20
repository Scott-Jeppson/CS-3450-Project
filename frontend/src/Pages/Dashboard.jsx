import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import Toolbar from "../components/toolbar.jsx";
import Statistics from "../components/statistics.jsx";
import SimTools from "../components/SimTools.jsx";
import "./dashboard.css";
import { getWelcomeMessage } from "../api.js";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const [stats, setStats] = useState(null);
    const [welcomeMessage, setWelcomeMessage] = useState("");
    const navigate = useNavigate();

useEffect(() => {
    if (!isLoggedIn) {
        navigate('/');
    } else {
        getWelcomeMessage().then(data => {
            setWelcomeMessage(data.message || "Welcome, user");
        });
    }
}, [isLoggedIn, navigate]);

    return (
        <div className="page-div" id="dashboard-page">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div id="main-content-dashboard">
                {isLoggedIn ? (
                    <>
                        <div className="welcome-banner">
                            {welcomeMessage}
                        </div>

                        <div className="sumo-section">
                            <SumoSim />
                            <SimTools setStats={setStats} />
                        </div>

                        <Statistics stats={stats} />
                    </>
                ) : (
                    <h1>You are not logged in</h1>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
