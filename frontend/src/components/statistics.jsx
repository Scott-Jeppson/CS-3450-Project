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

    // Calculate overall averages from individual bus statistics
    const overallAverages = useMemo(() => {
        if (!combinedData.length) return null;

        const validData = combinedData.filter(bus =>
            bus.speed !== "N/A" &&
            bus.waitTime !== "N/A" &&
            bus.duration !== "N/A"
        );

        if (!validData.length) return null;

        const totalSpeed = validData.reduce((sum, bus) => sum + parseFloat(bus.speed), 0);
        const totalWaitTime = validData.reduce((sum, bus) => sum + parseFloat(bus.waitTime), 0);
        const totalDuration = validData.reduce((sum, bus) => sum + parseFloat(bus.duration), 0);
        const totalCO2 = validData.reduce((sum, bus) => sum + bus.CO2, 0);
        const totalNOx = validData.reduce((sum, bus) => sum + bus.NOx, 0);
        const totalPMx = validData.reduce((sum, bus) => sum + bus.PMx, 0);
        const totalFuel = validData.reduce((sum, bus) => sum + bus.avgFuel, 0);

        const count = validData.length;

        return {
            meanSpeed: totalSpeed / count,
            meanTravelTime: totalDuration / count,
            meanWaitingTime: totalWaitTime / count,
            averageCO2: totalCO2 / count,
            averageNOx: totalNOx / count,
            averagePMx: totalPMx / count,
            averageFuel: totalFuel / count,
            totalVehiclesMeasured: count
        };
    }, [combinedData]);

    return (
        <div className="statistics-section">
            {!stats && (
                <div className="no-stats-message">
                    Play the simulation to generate statistics.
                </div>
            )}

            {stats && overallAverages && (
                <>
                <div style={{ width: "100%", marginTop: "20px", textAlign: "left" }}>
                    <h2>Overall Statistics</h2>
                </div>
                <div className="overall-stats-card">
                        <div className="stat-box-row">
                            <div className="stat-box-unit">
                                <div id="total-vehicles">
                                    <body>Total Vehicles:</body>
                                    <h4 id="h4-here">{overallAverages.totalVehiclesMeasured.toLocaleString()}</h4>
                                </div>
                            </div>
                        </div>

                        <div className="stat-box-row">
                            <div className="stat-box-unit">
                                <body>Average Speed</body>
                                <h4 id="h4-here">{convertToMPH(overallAverages.meanSpeed)} mph</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average Travel Time</body>
                                <h4 id="h4-here">{convertToMinutes(overallAverages.meanTravelTime)} min</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average Waiting Time</body>
                                <h4 id="h4-here">{convertToMinutes(overallAverages.meanWaitingTime)} min</h4>
                            </div>
                        </div>

                        <div className="stat-box-row">
                            <div className="stat-box-unit">
                                <body>Average Fuel</body>
                                <h4 id="h4-here">{convertToGallons(overallAverages.averageFuel.toFixed(2))} gal</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average CO₂</body>
                                <h4 id="h4-here">{convertToPounds(overallAverages.averageCO2)} lbs</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average NOx</body>
                                <h4 id="h4-here">{convertToPounds(overallAverages.averageNOx)} lbs</h4>
                            </div>
                            <div className="stat-box-unit">
                                <body>Average PMx</body>
                                <h4 id="h4-here">{convertToPounds(overallAverages.averagePMx)} lbs</h4>
                            </div>
                        </div>
                    </div>
                    </>
            )}

            {stats && (
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
