import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    return (
        <div className="page-div" id="dashboard-page">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div id="main-content">
                {isLoggedIn ? (
                        <h1>You are logged in</h1>
                    ) : (
                        <h1>You are not logged in</h1>
                    )
                }
            </div>
        </div>
    );
}

export default Home;
