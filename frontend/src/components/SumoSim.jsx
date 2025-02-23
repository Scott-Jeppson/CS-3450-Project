// import './SimulationMap.css';
import React from "react";
const SimulationMap = () => {

  return (
    <div>
      <h1>SUMO Traffic Simulation</h1>
      <iframe
        src="http://localhost:5000/"
        width="100%"
        height="1000px"
        style={{ border: "none" }}
        title="SUMO Simulation"
      />
    </div>
  );
};

export default SimulationMap;
