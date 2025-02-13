import React, { useEffect, useState } from "react";
import traffic_pic from "../traffic_pic.jpg";
import Navbar from "../components/navbar.jsx";

const Home = () => {

    return (
        <div width="100%" body="0px" style={{ backgroundColor: 'var(--lavender)' }}>
            <Navbar/>
            <div>
                <img src={traffic_pic} alt="Traffic at night" width="100%" height="100%" style={{ opacity: 0.7 }}></img>
            </div>
        </div>
    );
};

export default Home;
