// import './SimulationMap.css';
import React from "react";
import "./SumoSim.css";

const SimulationMap = () => {

  return (
    <div id="sumo-sim" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      <iframe
        className="sumo-iframe"
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
