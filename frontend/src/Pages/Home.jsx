import React, { useEffect, useState } from "react";
import traffic_pic from "../traffic_pic.jpg";
import Navbar from "../components/navbar.jsx";
import './home.css';

const Home = () => {

    return (
        <div className="page-div" id="home-page">
            <Navbar/>
            <div>
                <img src={traffic_pic} id="traffic-pic"></img>
            </div>
        </div>
    );
};

export default Home;
