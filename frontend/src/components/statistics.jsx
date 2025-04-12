import './statistics.css';
import React, { useState, useMemo } from "react";

function Statistics({ stats }) {
    const [openBusIds, setOpenBusIds] = useState(new Set());

    const toggleBus = (id) => {
        setOpenBusIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const combinedData = useMemo(() => {
        if (!stats) return [];

        const emissions = stats.emissions.perVehicle;
        const tripinfo = stats.tripinfo.trips;

        return Object.entries(emissions).map(([id, emission]) => {
            const trip = tripinfo.find(t => t.id === id) || {};
            return {
                id,
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

    return (
        <div className="stats-box" role="list">
            {combinedData.length === 0 ? (
                <div className="stats-item" role="listitem">
                    <b>No stats available.</b>
                </div>
            ) : (
                combinedData.map((bus) => (
                    <div key={bus.id} className="stats-item-wrapper">
                        <div
                            className="stats-item"
                            onClick={() => toggleBus(bus.id)}
                            role="listitem"
                        >
                            <b>{bus.id}</b>
                            <span className="material-symbols-outlined">
                                {openBusIds.has(bus.id) ? "expand_less" : "expand_more"}
                            </span>
                        </div>
                        {openBusIds.has(bus.id) && (
                            <div className="bus-details">
                                <p><b>Avg Speed:</b> {bus.speed} km/h</p>
                                <p><b>Wait Time:</b> {bus.waitTime} sec</p>
                                <p><b>Duration:</b> {bus.duration} sec</p>
                                <p><b>CO₂:</b> {Math.round(bus.CO2).toLocaleString()} g</p>
                                <p><b>NOx:</b> {Math.round(bus.NOx)} g</p>
                                <p><b>PMx:</b> {Math.round(bus.PMx)} g</p>
                                <p><b>Avg Fuel:</b> {bus.avgFuel.toFixed(2)} ml</p>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}

export default Statistics;