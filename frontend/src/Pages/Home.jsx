import React, { useEffect, useState } from "react";
import { getHelloWorld } from "../api";
import traffic_pic from "../traffic_pic.jpg"; 

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
            <div className='navbar'>
                <h2>Smart Transit</h2>
                <h4>Backend Response: {testMessage}</h4>
            </div>
            <div>
                <img src={traffic_pic} alt="Traffic at night" width="100%" height="flex"></img>
            </div>
        </div>
    );
};

export default Home;
