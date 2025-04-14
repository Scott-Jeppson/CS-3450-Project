import React from "react";
import { Link } from "react-router-dom";
import "./SumoSim.css";

const SumoSim = () => {
  return (
    <div id="sumo-sim">
      <Link to="/sumo" className="expand-btn" title="Expand Simulation">
        <span className="material-symbols-outlined">open_in_new</span>
      </Link>
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

export default SumoSim;