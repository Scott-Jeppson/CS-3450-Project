import './navbar.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getHelloWorld } from "../api";

function Navbar() {
    const [testMessage, setTestMessage] = useState("");

    {/* Kept for now to show that the backend is connected*/}
    useEffect(() => {
            async function fetchMessage() {
                const testData = await getHelloWorld();
                setTestMessage(testData.message);
            }
            fetchMessage();
        }, []);

    return (
        <div id='navbar'>
            <Link to="/" id="nav-brand"><h2>StreamLine</h2></Link>
            {/* Kept for now to show that the backend is connected*/}
            <h4>Backend Response: {testMessage}</h4>
            <Link to="/SignIn" id="nav-button">Sign In</Link>
        </div>
    );
}

export default Navbar;