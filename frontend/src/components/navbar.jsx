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
            <div id="nav-brand">
                <Link to="/">
                    <img id="logo" src={isLoggedIn ? "src/assets/Logo-White-Text-Purple-Background.svg" :
                        "src/assets/Logo-Light-Purple-Circle.svg"} />
                </Link>
                <Link to="/" id="nav-name">
                    <h2>StreamLine</h2>
                </Link>
            </div>
            {isLoggedIn ? (
                    <Link to="/" id="nav-button" onClick={handleLogout}>Log Out</Link>
                ) : (
                    <Link to="/signin" id="nav-button">Sign In</Link>
                )
            }
        </nav>
    );
}

export default Navbar;