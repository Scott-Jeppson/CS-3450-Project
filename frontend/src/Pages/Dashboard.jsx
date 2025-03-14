import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)" }}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div id="main-content">
                {isLoggedIn ? (
                        <SumoSim />
                    ) : (
                        <h1>You are not logged in</h1>
                    )
                }
            </div>
        </div>
    );
}

export default Dashboard;
