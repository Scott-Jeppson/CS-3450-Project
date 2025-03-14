import './toolbar.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";

function Toolbar({ isLoggedIn, setIsLoggedIn }) {

    const handleLogout = () => {
        // Clear the login token from localStorage and set isLoggedIn to false
        localStorage.removeItem('loginToken');
        setIsLoggedIn(false);
    };

    return (
        <div className="toolbar">
            <Link to="/">Home</Link>
            {/* tools go here */}
        </div>
    );
}

export default Toolbar;