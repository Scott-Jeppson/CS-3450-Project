import React, { useEffect, useState } from "react";
// import './SimulationMap.css';
import "./SumoSim.css";

const SimulationMap = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/welcome", {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error(response.status === 401 ? "Please sign in to see welcome message" : "Failed to fetch welcome message");
        }

        const data = await response.json();
        setWelcomeMessage(data.message);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchWelcomeMessage();
  }, []);

  return (
    <div id="sumo-sim" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <iframe
        className="sumo-iframe"
        src="http://localhost:5000/"
        width="100%"
        height="100%"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default SimulationMap;