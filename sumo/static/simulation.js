getMapboxToken();

function getMapboxToken() {
    const token = window.MAPBOX_TOKEN;
    if (!token) {
        console.error("MAPBOX_TOKEN not found.");
        return;
    }
    mapboxgl.accessToken = token;
    initializeMap();
}

function initializeMap() {
    const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [-111.692020, 40.296440],
        zoom: 11
    });

    const markers = {};
    let vehicleScale = 1300;
    let mapZoom = Math.pow(2, 11);
    let trackingId = null;
    let tracking = false;

    const socket = io();

    socket.on("update", (vehicles) => {
        vehicles.forEach((vehicle) => {
            const isBus = vehicle.type && vehicle.type.includes("bus");
            const iconPath = isBus ? "/static/bus-icon.png" : "/static/car-icon.PNG";

            if (!markers[vehicle.id]) {
                const el = document.createElement("div");
                el.className = isBus ? "bus-marker" : "car-marker";

                const labelHTML = isBus
                    ? `<div class="vehicle-label" style="display: ${
                          document.getElementById("labels-visible").checked ? "block" : "none"
                      }">${vehicle.id}</div>`
                    : "";

                el.innerHTML = `${labelHTML}<img src="${iconPath}" alt="Vehicle Icon">`;

                markers[vehicle.id] = new mapboxgl.Marker(el)
                    .setLngLat([vehicle.x, vehicle.y])
                    .addTo(map);

                const img = markers[vehicle.id].getElement().querySelector("img");
                img.dataset.scale = mapZoom / vehicleScale;
                img.addEventListener("click", () => startTracking(vehicle));
            } else {
                markers[vehicle.id].setLngLat([vehicle.x, vehicle.y]);
            }

            const img = markers[vehicle.id].getElement().querySelector("img");
            img.dataset.rotation = vehicle.angle;
            img.style.transform = `scale(${img.dataset.scale}) rotate(${vehicle.angle}deg)`;
        });
    });

    function clearAllMarkers() {
        Object.values(markers).forEach((m) => m.remove());
        Object.keys(markers).forEach((id) => delete markers[id]);
    }

    socket.on("simulationEnded", clearAllMarkers);

    document.getElementById("cancel-follow").addEventListener("click", () => {
        tracking = false;
        trackingId = null;
        document.getElementById("tracking-info").textContent = "";
        const bar = document.getElementById("tracking-status");
        bar.classList.remove("expanded");
        bar.classList.add("collapsed");
        map.dragPan.enable();
    });

    function startTracking(v) {
        trackingId = v.id;
        tracking = true;
        document.getElementById("tracking-info").textContent = v.id;
        const bar = document.getElementById("tracking-status");
        bar.classList.remove("collapsed");
        bar.classList.add("expanded");
        map.dragPan.disable();
        map.easeTo({ center: [v.x, v.y], duration: 100 });
    }

    function updateMarkerSize() {
        const scaleFactor = mapZoom / vehicleScale;
        Object.values(markers).forEach((m) => {
            const img = m.getElement().querySelector("img");
            img.dataset.scale = scaleFactor;
            img.style.transform = `scale(${scaleFactor}) rotate(${
                img.dataset.rotation || 0
            }deg)`;
        });
    }

    map.on("load", () => {
        mapZoom = Math.pow(2, map.getZoom());
        updateMarkerSize();
    });

    map.on("zoom", () => {
        mapZoom = Math.pow(2, map.getZoom());
        updateMarkerSize();
    });

    document.getElementById("scaling").addEventListener("input", (e) => {
        vehicleScale = 12300 - parseFloat(e.target.value);
        updateMarkerSize();
    });

    document.getElementById("labels-visible").addEventListener("change", (e) => {
        const on = e.target.checked;
        document
            .querySelectorAll(".vehicle-label")
            .forEach((lbl) => (lbl.style.display = on ? "block" : "none"));
    });

    map.dragPan.enable();

    setInterval(() => {
        if (tracking && markers[trackingId]) {
            const { lng, lat } = markers[trackingId].getLngLat();
            map.easeTo({ center: [lng, lat], duration: 200 });
        }
    }, 200);
}