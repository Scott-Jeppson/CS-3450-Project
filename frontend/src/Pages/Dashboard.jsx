// Dashboard.jsx
import { useState } from "react";
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import Toolbar from "../components/toolbar.jsx";
import Statistics from "../components/statistics.jsx";
import SimTools from "../components/SimTools.jsx";
import "./dashboard.css";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const [stats, setStats] = useState(null);

    return (
        <div className="page-div">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div id="main-content-dashboard">
                {isLoggedIn ? (
                    <>
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