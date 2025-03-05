import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import Toolbar from "../components/toolbar.jsx";
import "./dashboard.css";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)"}}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            
            

            <div id="main-content">
                {isLoggedIn ? (
                        // <>
                        //     {/* <Toolbar /> */}
                        //     {/* <SumoSim /> */}
                        // </>
                        <div className="dashboard-screen">
                            {/* <div className="toolbar"></div> */}
                            <Toolbar />
                            <div className="info-screen">
                                <div className="stats">
                                    <div className="stats-items">10%</div>
                                    <div className="stats-items">20%</div>
                                    <div className="stats-items">30%</div>
                                </div>
                                <div className="tools">
                                    <SumoSim />
                                    <div className="tools-items">Tool</div>
                                </div>
                                <div className="tools">
                                    <SumoSim />
                                    <div className="tools-items">Tool</div>
                                </div>
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
