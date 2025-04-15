import './toolbar.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useRef } from "react";

function Toolbar({ isLoggedIn, setIsLoggedIn }) {

    const [isToolbarCollapsed, setIsToolbarCollapsed] = useState(true);

    const handleLogout = () => {
        localStorage.removeItem('loginToken');
        setIsLoggedIn(false);
        setIsToolbarCollapsed(false);
    };

    const toggleToolbar = () => {
        setIsToolbarCollapsed(!isToolbarCollapsed);
    };

    const toolbarRef = useRef(null);

    useEffect(() => {
        const closeToolbar = (e) => {
            if (!isToolbarCollapsed && !event.target.closest('#toggle-drawer') && !toolbarRef.current.contains(e.target)) {
                setIsToolbarCollapsed(true);
            }
        };

        document.addEventListener('click', closeToolbar);

        return () => document.removeEventListener('click', closeToolbar);
    }, [isToolbarCollapsed]);

    return (
        <>
            <button id="toggle-drawer" onClick={toggleToolbar} aria-expanded={!isToolbarCollapsed} aria-label="Menu">☰</button>

            <div className={`toolbar ${isToolbarCollapsed ? 'collapsed' : ''}`} ref={toolbarRef}>
                <Link to="/" className="drawer-link" aria-label="Home">Home</Link>
    {/*             <Link to="/about" className="drawer-link" aria-label="About">About</Link> */}
    {/*             <Link to="/sumo" className="drawer-link" aria-label="Traffic simulation">Traffic Simulation</Link> */}
                <Link to="/" className="drawer-link" aria-label="Log out" onClick={handleLogout}>Log Out</Link>
            </div>
        </>
    );
}

export default Toolbar;