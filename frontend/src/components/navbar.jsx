import './navbar.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";

function Navbar({ isLoggedIn, setIsLoggedIn }) {

    const handleLogout = () => {
        // Clear the login token from localStorage and set isLoggedIn to false
        localStorage.removeItem('loginToken');
        setIsLoggedIn(false);
    };

    return (
        <nav id={isLoggedIn ? "navbar-logged-in" : "navbar"}>
            <Link to={isLoggedIn ? "/dashboard" : "/"} id="nav-brand" aria-label={isLoggedIn ? "StreamLine Dashboard" : "StreamLine Home"}>
                <img id="logo" alt="" src={isLoggedIn ? "src/assets/Logo-White-Text-Purple-Background.svg" :
                    "src/assets/Logo-Light-Purple-Circle.svg"}
                />
                <h2 id="nav-name">StreamLine</h2>
            </Link>
            {isLoggedIn ? (
                    <Link to="/" id="nav-button" aria-label="Log out" onClick={handleLogout}>Log Out</Link>
                ) : (
                    <Link to="/signin" id="nav-button" aria-label="Sign in">Sign In</Link>
                )
            }
        </nav>
    );
}

export default Navbar;