import "./statistics.css";
import React, { useState, useMemo } from "react";

const convertToMPH = (kmh) => {
    return (kmh * 0.621371).toFixed(1);
};

const convertToGallons = (ml) => {
    return (ml * 2 / 1000 / 0.745 / 3.78541).toFixed(2);
};

const convertToPounds = (mg) => {
    return (mg / 1000 * 0.00220462).toFixed(2);
};

const convertToMinutes = (seconds) => {
    if (seconds === "N/A") return "N/A";
    return (seconds / 60).toFixed(1);
};

function Statistics({ stats, trafficLevel }) {
    const [openBusIds, setOpenBusIds] = useState(new Set());

    const toggleBus = (id) => {
        setOpenBusIds(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
            return newSet;
        });
    };

    const combinedData = useMemo(() => {
        if (!stats) return [];

        const emissions = stats.emissions.perVehicle;
        const tripinfo = stats.tripinfo.trips;

        return Object.entries(emissions).map(([id, emission]) => {
            const trip = tripinfo.find(t => t.id === id) || {};
            const routeNumber = id.match(/^pt_bus_(\w+):/)?.[1];

            // Validate and clean the data
            const CO2 = emission.CO2 || 0;
            const NOx = emission.NOx || 0;
            const PMx = emission.PMx || 0;
            const avgFuel = emission.averageFuel || 0;

            return {
                id,
                routeNumber,
                CO2,
                NOx,
                PMx,
                avgFuel,
                speed: (trip.routeLength && trip.duration) ? (trip.routeLength / trip.duration * 3.6).toFixed(2) : "N/A",
                waitTime: trip.waitingTime ?? "N/A",
                duration: trip.duration ?? "N/A",
            };
        });
    }, [stats]);

    const overall = stats?.summary?.averages;
    const totals = stats?.emissions?.totals;

    // Validate total vehicles count
    const totalVehicles = totals?.totalVehiclesMeasured || 0;
    const hasStats = overall && totals;

    return (
        <div className="statistics-section">
            {!hasStats && (
                <div className="no-stats-message">
                    Play the simulation to generate statistics.
                </div>
            )}

            {hasStats && (
                <>
                <div style={{ width: "100%", marginTop: "20px", textAlign: "left" }}>
                    <h2>Overall Statistics</h2>
                </div>
                <div className="overall-stats-card">
                        <div className="stat-box-row">
                            <div className="stat-box-unit">
                                <div id="total-vehicles">
                                    <body>Total Vehicles:</body>
                                    <h4 id="h4-here">{totalVehicles.toLocaleString()}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="stat-box-row">
                            <div className="stat-box-unit">
                                <body>Average Speed</body>
                                <h4 id="h4-here">{convertToMPH(overall.meanSpeed)} mph</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average Travel Time</body>
                                <h4 id="h4-here">{convertToMinutes(overall.meanTravelTime)} min</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average Waiting Time</body>
                                <h4 id="h4-here">{convertToMinutes(overall.meanWaitingTime)} min</h4>
                            </div>
                        </div>

                        <div className="stat-box-row">
                            <div className="stat-box-unit">
                                <body>Average Fuel</body>
                                <h4 id="h4-here">{totals.averageFuel} gal</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average CO₂</body>
                                <h4 id="h4-here">{convertToPounds(totals.averageCO2)} lbs</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average NOx</body>
                                <h4 id="h4-here">{convertToPounds(totals.averageNOx)} lbs</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average PMx</body>
                                <h4 id="h4-here">{convertToPounds(totals.averagePMx)} lbs</h4>
                            </div>
                        </div>
                    </div>
                    </>
            )}

            {hasStats && (
                <div className="bus-section">
                    <div style={{ width: "100%", textAlign: "left" , marginBottom: "15px" }}>
                        <h2>Bus Statistics</h2>
                    </div>

                    {combinedData.map((bus) => (
                        <div key={bus.id} className="dropdown-wrapper">
                            <button 
                                className="dropdown-bar" 
                                onClick={() => toggleBus(bus.id)}
                                aria-expanded={openBusIds.has(bus.id)}
                                aria-controls={`bus-stats-${bus.id}`}
                            >
                                <b>
                                    <a
                                        href={`https://www.rideuta.com/Rider-Tools/Vehicle-Locator/Map?route=${bus.routeNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        Route {bus.routeNumber ?? bus.id}
                                    </a>
                                </b>
                                <span className="material-symbols-outlined" aria-hidden="true">
                                    {openBusIds.has(bus.id) ? "expand_less" : "expand_more"}
                                </span>
                            </button>

                            {openBusIds.has(bus.id) && (
                                <div 
                                    className="bus-stats-card" 
                                    id={`bus-stats-${bus.id}`}
                                    role="region"
                                    aria-label={`Statistics for Route ${bus.routeNumber ?? bus.id}`}
                                >
                                    <div className="stat-box-row">
                                        <div className="stat-box-unit">
                                            <body>Average Speed</body>
                                            <h4 id="h4-here">{convertToMPH(bus.speed)} mph</h4>
                                        </div>
                                        <div className="stat-box-unit">
                                            <body>Travel Time</body>
                                            <h4 id="h4-here">{convertToMinutes(bus.duration)} min</h4>
                                        </div>
                                        <div className="stat-box-unit">
                                            <body>Waiting Time</body>
                                            <h4 id="h4-here">{convertToMinutes(bus.waitTime)} min</h4>
                                        </div>
                                    </div>

                                    <div className="stat-box-row">
                                        <div className="stat-box-unit">
                                            <body>Average Fuel</body>
                                            <h4 id="h4-here">{convertToGallons(bus.avgFuel)} gal</h4>
                                        </div>
                                        <div className="stat-box-unit">
                                            <body>CO₂</body>
                                            <h4 id="h4-here">{convertToPounds(bus.CO2)} lbs</h4>
                                        </div>
                                        <div className="stat-box-unit">
                                            <body>NOx</body>
                                            <h4 id="h4-here">{convertToPounds(bus.NOx)} lbs</h4>
                                        </div>
                                        <div className="stat-box-unit">
                                            <body>PMx</body>
                                            <h4 id="h4-here">{convertToPounds(bus.PMx)} lbs</h4>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Statistics;
