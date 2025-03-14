import './toolbar.css';
import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";

function Toolbar({ isLoggedIn, setIsLoggedIn }) {
    const handleGoingHome = () => {
        navigate('/');
    };

    return (
        <div className="toolbar">
            <Link onClick={handleGoingHome}>Home</Link>
            {/* tools go here */}
        </div>
    );
}

export default Toolbar;