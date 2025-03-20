import './toolbar.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";

function Toolbar({ isLoggedIn, setIsLoggedIn }) {

    const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(true);

    const handleLogout = () => {
        // Clear the login token from localStorage and set isLoggedIn to false
        localStorage.removeItem('loginToken');
        setIsLoggedIn(false);
        setIsToolbarCollapsed(false);
    };

    const toggleToolbar = () => {
        setIsToolbarCollapsed(!isToolbarCollapsed);
    };

    return (
        <>
            <button id="toggle-drawer" onClick={toggleToolbar}>☰</button>

            <div className={`toolbar ${isToolbarCollapsed ? 'collapsed' : ''}`}>
                <Link to="/" className="drawer-link" aria-label="Home">Home</Link>
    {/*             <Link to="/about" className="drawer-link" aria-label="About">About</Link> */}
    {/*             <Link to="/sumo" className="drawer-link" aria-label="Traffic simulation">Traffic Simulation</Link> */}
                <Link to="/" className="drawer-link" aria-label="Log out" onClick={handleLogout}>Log Out</Link>
            </div>
        </>
    );
}

export default Toolbar;