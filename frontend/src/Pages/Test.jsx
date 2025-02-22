import React, { useEffect, useState } from "react";
import { getHelloWorld } from "../api";

function Test() {
    // Temporary page to test backend connection

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
        <div>
            <h4>Backend Response: {testMessage}</h4>
        </div>
    )
}

export default Test;