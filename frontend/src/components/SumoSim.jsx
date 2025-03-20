// import './SimulationMap.css';
import React from "react";
const SimulationMap = () => {

  return (
    <div id="sumo-sim" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <h1>Traffic Simulation</h1>
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
