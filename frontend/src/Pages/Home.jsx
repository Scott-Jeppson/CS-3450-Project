import React, { useEffect, useState } from "react";
import { getHelloWorld } from "../api";

const Home = () => {
    const [testMessage, setTestMessage] = useState("");

    useEffect(() => {
        async function fetchMessage() {
            const testData = await getHelloWorld();
            setTestMessage(testData.message);
        }
        fetchMessage();
    }, []);

    return (
        <div>
            <h1>Home Page</h1>
            <h2>Backend Response: {testMessage}</h2>
        </div>
    );
};

export default Home;
