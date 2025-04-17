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

        const emissions = stats.emissions?.perVehicle ?? {};
        const tripinfo = stats.tripinfo?.trips ?? [];

        return Object.entries(emissions).map(([id, emission]) => {
            const trip = tripinfo.find(t => t.id === id) || {};
            const routeNumber = id.match(/^pt_bus_(\w+):/)?.[1];

            return {
                id,
                routeNumber,
                CO2: emission.CO2 ?? 0,
                NOx: emission.NOx ?? 0,
                PMx: emission.PMx ?? 0,
                avgFuel: emission.averageFuel ?? 0,
                speed: (trip.routeLength && trip.duration) ? (trip.routeLength / trip.duration * 3.6).toFixed(2) : "N/A",
                waitTime: trip.waitingTime ?? "N/A",
                duration: trip.duration ?? "N/A",
            };
        });
    }, [stats]);

    const overall = stats?.summary?.averages ?? {};
    const totals = stats?.emissions?.totals ?? {};

    return (
        <div className="statistics-section">
            <h2>Overall Statistics</h2>
            
            <div className="statistics-group">
                
                <div className="statistics-row">
                    <div className="statistics-item" style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ flex: 1, textAlign: "left" }}>
                            <body>Total Vehicles:</body>
                        </div>
                        <div style={{ flex: 1, textAlign: "left" }}>
                            <h3>{ totals.totalVehiclesMeasured?.toLocaleString() ?? "N/A"}</h3>
                        </div>
                    </div>
                </div>

                <div className="statistics-row">
                    <div className="statistics-item" style={{ padding: "2rem" }}>
                        <body>Average Speed</body>
                        <h3>{overall.meanSpeed?.toFixed(2) ?? "N/A"} km/h</h3>
                    </div>
                    <div className="statistics-item" style={{ padding: "2rem" }}>
                        <body>Average Travel Time</body>
                        <h3>{(overall.meanTravelTime / 60)?.toFixed(1) ?? "N/A"} min</h3>
                    </div>
                    <div className="statistics-item" style={{ padding: "2rem" }}>
                        <body>Average Waiting Time</body>
                        <h3>{overall.meanWaitingTime?.toFixed(1) ?? "N/A"} sec</h3>
                    </div>            
                </div>

                <div className="statistics-row">
                    <div className="statistics-item" style={{ padding: "1rem" }}>
                        <body>Average Fuel</body>
                        <h3>{(totals.averageFuel ?? 0).toFixed(2)} ml</h3>
                    </div>
                    <div className="statistics-item" style={{ padding: "1rem" }}>
                        <body>Average CO₂</body>
                        <h3>{Math.round(totals.averageCO2 ?? 0).toLocaleString()} g</h3>
                    </div>
                    <div className="statistics-item" style={{ padding: "1rem" }}>
                        <body>Average NOx</body>
                        <h3>{(totals.averageNOx ?? 0).toFixed(2)} g</h3>
                    </div>
                    <div className="statistics-item" style={{ padding: "1rem" }}>
                        <body>Average PMx</body>
                        <h3>{(totals.averagePMx ?? 0).toFixed(2)} g</h3>
                    </div>
                </div>

            </div>

            <div className="bus-stats-card">
                <h2>Bus Statistics</h2>
                {combinedData.map((bus) => (
                    <div key={bus.id} className="stats-item-wrapper">
                        <div className="stats-item" onClick={() => toggleBus(bus.id)}>
                        {/* <div className="statistics-group" onClick={() => toggleBus(bus.id)}> */}
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

                            <div className="statistics-group" style={{ color: "var(--light-purple)"}}>

                                <div className="statistics-row" style={{ height: "40px" }}>
                                    <div className="statistics-item">
                                        <body>Average Speed</body>
                                        <h3>{bus.speed} km/h</h3>
                                    </div>
                                    <div className="statistics-item">
                                        <body>Travel Time</body>
                                        <h3>{bus.duration} sec</h3>
                                    </div>
                                    <div className="statistics-item">
                                        <body>Waiting Time</body>
                                        <h3>{bus.waitTime} sec</h3>
                                    </div>
                                </div>

                                <div className="statistics-row" style={{ height: "30px" }}>
                                    <div className="statistics-item">
                                        <body>Average Fuel</body>
                                        <h3>{bus.avgFuel.toFixed(2)} ml</h3>
                                    </div>
                                    <div className="statistics-item">
                                        <body>CO₂</body>
                                        <h3>{Math.round(bus.CO2).toLocaleString()} g</h3>
                                    </div>
                                    <div className="statistics-item">
                                        <body>NOx</body>
                                        <h3>{Math.round(bus.NOx)} g</h3>
                                    </div>
                                    <div className="statistics-item">
                                        <body>PMx</body>
                                        <h3>{Math.round(bus.PMx)} g</h3>
                                    </div>
                                </div>

                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Statistics;


// import "./statistics.css";
// import React, { useState, useMemo } from "react";

// function Statistics({ stats, trafficLevel }) {
//     const [openBusIds, setOpenBusIds] = useState(new Set());

//     const toggleBus = (id) => {
//         setOpenBusIds(prev => {
//             const newSet = new Set(prev);
//             newSet.has(id) ? newSet.delete(id) : newSet.add(id);
//             return newSet;
//         });
//     };

//     const combinedData = useMemo(() => {
//         if (!stats) return [];

//         const emissions = stats.emissions.perVehicle;
//         const tripinfo = stats.tripinfo.trips;

//         return Object.entries(emissions).map(([id, emission]) => {
//             const trip = tripinfo.find(t => t.id === id) || {};
//             const routeNumber = id.match(/^pt_bus_(\w+):/)?.[1];

//             return {
//                 id,
//                 routeNumber,
//                 CO2: emission.CO2,
//                 NOx: emission.NOx,
//                 PMx: emission.PMx,
//                 avgFuel: emission.averageFuel,
//                 speed: (trip.routeLength && trip.duration) ? (trip.routeLength / trip.duration * 3.6).toFixed(2) : "N/A",
//                 waitTime: trip.waitingTime ?? "N/A",
//                 duration: trip.duration ?? "N/A",
//             };
//         });
//     }, [stats]);

//     const overall = stats?.summary?.averages;
//     const totals = stats?.emissions?.totals;

//     const hasStats = overall && totals;
//     // const hasStats = truthy;

//     return (
//         <div className="statistics-section">

//             {!hasStats && (
//                 <div className="no-stats-message">
//                     Play the simulation to generate statistics.
//                 </div>
//             )}

//             {hasStats && (
//                 <div className="overall-stats-card">
//                     <h2>Overall Statistics</h2>
//                     <p><b>Avg Speed:</b> {overall.meanSpeed.toFixed(2)} km/h</p>
//                     <p><b>Avg Travel Time:</b> {(overall.meanTravelTime / 60).toFixed(1)} min</p>
//                     <p><b>Avg Waiting Time:</b> {(overall.meanWaitingTime).toFixed(1)} sec</p>
//                     <p><b>Total Vehicles:</b> {totals.totalVehiclesMeasured.toLocaleString()}</p>
//                     <p><b>Avg CO₂:</b> {Math.round(totals.averageCO2).toLocaleString()} g</p>
//                     <p><b>Avg Fuel:</b> {totals.averageFuel.toFixed(2)} ml</p>
//                     <p><b>Avg NOx:</b> {totals.averageNOx.toFixed(2)} g</p>
//                     <p><b>Avg PMx:</b> {totals.averagePMx.toFixed(2)} g</p>
//                 </div>
//             )}

//             {hasStats && (
//                 <div className="bus-stats-card">
//                     <h2>Bus Statistics</h2>
//                     {combinedData.map((bus) => (
//                         <div key={bus.id} className="stats-item-wrapper">
//                             <div className="stats-item" onClick={() => toggleBus(bus.id)}>
//                                 <b>
//                                     <a
//                                         href={`https://www.rideuta.com/Rider-Tools/Vehicle-Locator/Map?route=${bus.routeNumber}`}
//                                         target="_blank"
//                                         rel="noopener noreferrer"
//                                         onClick={(e) => e.stopPropagation()}
//                                     >
//                                         Route {bus.routeNumber ?? bus.id}
//                                     </a>
//                                 </b>
//                                 <span className="material-symbols-outlined">
//                                     {openBusIds.has(bus.id) ? "expand_less" : "expand_more"}
//                                 </span>
//                             </div>
//                             {openBusIds.has(bus.id) && (
//                                 <div className="bus-details">
//                                     <p><b>Avg Speed:</b> {bus.speed} km/h</p>
//                                     <p><b>Wait Time:</b> {bus.waitTime} sec</p>
//                                     <p><b>Duration:</b> {bus.duration} sec</p>
//                                     <p><b>CO₂:</b> {Math.round(bus.CO2).toLocaleString()} g</p>
//                                     <p><b>NOx:</b> {Math.round(bus.NOx)} g</p>
//                                     <p><b>PMx:</b> {Math.round(bus.PMx)} g</p>
//                                     <p><b>Avg Fuel:</b> {bus.avgFuel.toFixed(2)} ml</p>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default Statistics;
