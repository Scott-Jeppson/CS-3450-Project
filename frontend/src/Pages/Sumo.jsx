import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import SumoSim from "../components/SumoSim.jsx";
import "./Sumo.css";

const Dashboard = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

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
                    )
                }
            </div>
        </div>
    );
}

export default Dashboard;
