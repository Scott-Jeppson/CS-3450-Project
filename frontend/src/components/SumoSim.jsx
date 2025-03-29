import React, { useEffect, useState } from "react";
// import './SimulationMap.css';

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
      <h1>Traffic Simulation</h1>
      {welcomeMessage && (
        <div style={{ padding: "10px", backgroundColor: "#f0f0f0", marginBottom: "10px" }}>
          {welcomeMessage}
        </div>
      )}
      {error && (
        <div style={{ padding: "10px", backgroundColor: "#ffebee", color: "#d32f2f", marginBottom: "10px" }}>
          {error}
        </div>
      )}
      <iframe
        src="http://localhost:5000/"
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="SUMO Simulation"
      />
    </div>
  );
};

export default SimulationMap;