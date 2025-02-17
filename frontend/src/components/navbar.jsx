import './navbar.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getHelloWorld } from "../api";

function Navbar() {
    const [testMessage, setTestMessage] = useState("");

    useEffect(() => {
            async function fetchMessage() {
                const testData = await getHelloWorld();
                setTestMessage(testData.message);
            }
            fetchMessage();
        }, []);

    return (
        <div id='navbar'>
            <h2>StreamLine</h2>
            <h4>Backend Response: {testMessage}</h4>
            <Link id="sign-in" to="/signin">Sign In</Link>
        </div>
    );
}

export default Navbar;