import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import Toolbar from "../components/toolbar.jsx";
import "./dashboard.css";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    // const [isLoggedIn, setIsLoggedIn] = useState(true); // Example logged-in state
    const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(false); // State for toolbar collapse

    const toggleToolbar = () => {
        setIsToolbarCollapsed(!isToolbarCollapsed); // Toggle the toolbar state
    };

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)", overflowY: "auto" }}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            
            

            <div id="main-content">
                {isLoggedIn ? (
                        <div className="dashboard-screen">
                            {/* <div className="toolbar"></div> */}
                            {/* <Toolbar /> */}
                            <div className={`toolbar ${isToolbarCollapsed ? 'toolbar-collapsed' : ''}`} style={{ alignItems: "right" }}>
                                <button className="toggle-btn" onClick={toggleToolbar}>
                                    ☰
                                </button>
                            </div>
                            <div className="info-screen">
                                <div className="stats">
                                    {/* <div className="stats-items">10%</div>
                                    <div className="stats-items">20%</div>
                                    <div className="stats-items">30%</div>
                                    <div className="stats-items">40%</div> */}
                                </div>
                                <div className="tools">
                                    <SumoSim />
                                    {/* <div className="tools-items">Tool 1</div>
                                    <div className="tools-items">Tool 2</div> */}
                                </div>
                                {/* <div className="tools">
                                    <SumoSim />
                                    <div className="tools-items">Tool 3</div>
                                </div> */}
                            </div>
                        </div>
                    ) : (
                        <h1>You are not logged in</h1>
                    )
                }
            </div>
        </div>
    );
}

export default Dashboard;
