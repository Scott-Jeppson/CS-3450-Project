import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import Toolbar from "../components/toolbar.jsx";
import Statistics from "../components/statistics.jsx";
import "./dashboard.css";
import SimTools from '../components/SimTools';

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const [stats, setStats] = useState(null); // shared stats data

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)", height: "100vh" }}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div id="main-content-dashboard">
                {isLoggedIn ? (
                    <>
                        {/* <Toolbar /> */}

                            <div className="sumo-sim">
                                <SumoSim />
                            </div>
                            
                            <div className="sim-tools">
                                <SimTools setStats={setStats} />
                            </div>

                            <div className="stats">
                                <Statistics stats={stats} />
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
