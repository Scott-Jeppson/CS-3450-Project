import './navbar.css';
import React, { useEffect, useState } from "react";
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
        <div className='navbar'>
            <h2>StreamLine</h2>
            <h4>Backend Response: {testMessage}</h4>
        </div>
    );
}

export default Navbar;