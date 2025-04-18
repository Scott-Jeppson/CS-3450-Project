import "./statistics.css";
import React, { useState, useMemo } from "react";

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

            return {
                id,
                routeNumber,
                CO2: emission.CO2,
                NOx: emission.NOx,
                PMx: emission.PMx,
                avgFuel: emission.averageFuel,
                speed: (trip.routeLength && trip.duration) ? (trip.routeLength / trip.duration * 3.6).toFixed(2) : "N/A",
                waitTime: trip.waitingTime ?? "N/A",
                duration: trip.duration ?? "N/A",
            };
        });
    }, [stats]);

    const overall = stats?.summary?.averages;
    const totals = stats?.emissions?.totals;

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
                <div style={{ width: "100%", textAlign: "left" }}>
                    <h2>Overall Statistics</h2>
                </div><div className="overall-stats-card">

                        <div className="stat-box-row">
                            <div className="stat-box-unit" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                                <div style={{ flex: 1, textAlign: "left" }}>
                                    <body>Total Vehicles:</body>
                                </div>
                                <div style={{ flex: 1, textAlign: "left" }}>
                                    <h3>{totals.totalVehiclesMeasured?.toLocaleString()}</h3>
                                </div>
                            </div>
                        </div>

                        <div className="stat-box-row">
                            <div className="stat-box-unit" style={{ padding: "2rem" }}>
                                <body>Average Speed</body>
                                <h3>{overall.meanSpeed?.toFixed(2)} km/h</h3>
                            </div>
                            <div className="stat-box-unit" style={{ padding: "2rem" }}>
                                <body>Average Travel Time</body>
                                <h3>{(overall.meanTravelTime / 60)?.toFixed(1)} min</h3>
                            </div>
                            <div className="stat-box-unit" style={{ padding: "2rem" }}>
                                <body>Average Waiting Time</body>
                                <h3>{overall.meanWaitingTime?.toFixed(1)} sec</h3>
                            </div>
                        </div>

                        <div className="stat-box-row">
                            <div className="stat-box-unit" style={{ padding: "1rem" }}>
                                <body>Average Fuel</body>
                                <h3>{(totals.averageFuel).toFixed(2)} ml</h3>
                            </div>
                            <div className="stat-box-unit" style={{ padding: "1rem" }}>
                                <body>Average CO₂</body>
                                <h3>{Math.round(totals.averageCO2).toLocaleString()} g</h3>
                            </div>
                            <div className="stat-box-unit" style={{ padding: "1rem" }}>
                                <body>Average NOx</body>
                                <h3>{(totals.averageNOx).toFixed(2)} g</h3>
                            </div>
                            <div className="stat-box-unit" style={{ padding: "1rem" }}>
                                <body>Average PMx</body>
                                <h3>{(totals.averagePMx).toFixed(2)} g</h3>
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

                            <div className="dropdown-bar" onClick={() => toggleBus(bus.id)}>

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
                                <span className="material-symbols-outlined">
                                    {openBusIds.has(bus.id) ? "expand_less" : "expand_more"}
                                </span>
                            </div>

                            {openBusIds.has(bus.id) && (
                                <div className="bus-stats-card" style={{ backgroundColor: "var(--light-purple)"}}>

                                    <div className="stat-box-row">
                                        <div className="stat-box-unit" style={{ padding: "2rem" }}>
                                            <body>Average Speed</body>
                                            <h3>{bus.speed} km/h</h3>
                                        </div>
                                        <div className="stat-box-unit" style={{ padding: "2rem" }}>
                                            <body>Travel Time</body>
                                            <h3>{bus.duration} sec</h3>
                                        </div>
                                        <div className="stat-box-unit" style={{ padding: "2rem" }}>
                                            <body>Waiting Time</body>
                                            <h3>{bus.waitTime} sec</h3>
                                        </div>
                                    </div>

                                    <div className="stat-box-row">
                                        <div className="stat-box-unit" style={{ padding: "1rem" }}>
                                            <body>Average Fuel</body>
                                            <h3>{bus.avgFuel.toFixed(2)} ml</h3>
                                        </div>
                                        <div className="stat-box-unit" style={{ padding: "1rem" }}>
                                            <body>CO₂</body>
                                            <h3>{Math.round(bus.CO2).toLocaleString()} g</h3>
                                        </div>
                                        <div className="stat-box-unit" style={{ padding: "1rem" }}>
                                            <body>NOx</body>
                                            <h3>{Math.round(bus.NOx)} g</h3>
                                        </div>
                                        <div className="stat-box-unit" style={{ padding: "1rem" }}>
                                            <body>PMx</body>
                                            <h3>{Math.round(bus.PMx)} g</h3>
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
