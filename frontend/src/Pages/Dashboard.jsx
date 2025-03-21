import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import Toolbar from "../components/toolbar.jsx";
import Statistics from "../components/statistics.jsx";
import "./dashboard.css";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {

    return (
        <div className="page-div" style={{ backgroundColor: "var(--grey)", height: "100vh" }}>
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            <div id="main-content-dashboard">
                {isLoggedIn ? (
                    <>
                        <Toolbar />

                        <div className="sumo-sim">
                            <SumoSim />
                        </div>

                        <div className="sim-tools">
                            Add simulation tools here (possible: play, pause, rewind, speed up, slow down, etc.)
                        </div>

                        <div className="stats">
                            <Statistics />
                        </div>
{/*                                 <div className="tools"> */}
{/*                                     <SumoSim /> */}
{/*                                     <div className="tools-items">Tool 1</div> */}
{/*                                     <div className="tools-items">Tool 2</div> */}
{/*                                 </div> */}
                    </>
                    ) : (
                        <h1>You are not logged in</h1>
                    )
                }
            </div>
        </div>
    );
}

export default Dashboard;
