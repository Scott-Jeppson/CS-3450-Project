import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import Toolbar from "../components/toolbar.jsx";
import Statistics from "../components/statistics.jsx";
import "./dashboard.css";
import SimTools from '../components/SimTools';

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)", height: "100vh" }}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            {isLoggedIn && (
                <div id="main-content-dashboard">
                    <Toolbar />

                    <div className="sumo-sim">
                        <SumoSim />
                    </div>

                    <div className="sim-tools">
                        <SimTools />
                    </div>

                    <div className="stats">
                        <Statistics />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;