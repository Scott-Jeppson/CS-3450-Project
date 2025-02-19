import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar.jsx";
import './home.css';

const Home = ({ isLoggedIn, setIsLoggedIn }) => {
    const navigate = useNavigate();

    const handleSignInClick = () => {
        navigate('/signin');
    };

    const handleCreateAccountClick = () => {
        navigate('/createaccount');
    };

    return (
        <div className="page-div" id="home-page">
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div id="main-content">
                <div id="welcome-box">
                    <h1>Welcome to StreamLine!</h1>
                    <p> StreamLine is a traffic simulation and optimization tool designed to help traffic managers in
                        Utah County analyze and improve traffic flow.
                    </p>
                    <div className="divider">
                      <h4>Please sign in to continue:</h4>
                    </div>
                    <button className="home-button" onClick={handleSignInClick}>Sign In</button>
                    <button className="home-button" onClick={handleCreateAccountClick}>Create Account</button>
                </div>
            </div>
        </div>
    );
}

export default Home;
