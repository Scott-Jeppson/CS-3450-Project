getMapboxToken();
import { API_BASE_URL } from '@/constants'

async function getMapboxToken() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/mapbox-token`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        mapboxgl.accessToken = data.token;
        initializeMap();
    } catch(error){
        console.error("Error fetching mapbox token:", error);
    }
}

function initializeMap() {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-111.692020, 40.296440],
        zoom: 11
    });

    const markers = {};
    let vehicleScale = 1300;
    let mapZoom = Math.pow(2, 11);
    let trackingId = null;
    let tracking = false;

    const socket = io();

    socket.on('update', (vehicles) => {
        vehicles.forEach(vehicle => {
            const isBus = vehicle.type && vehicle.type.includes('bus');
            const iconPath = isBus ? '/static/bus-icon.png' : '/static/car-icon.PNG';

            if (!markers[vehicle.id]) {
                const el = document.createElement('div');
                el.className = isBus ? 'bus-marker' : 'car-marker';

                const labelHTML = isBus
                    ? `<div class="vehicle-label" style="display: ${document.getElementById("labels-visible").checked ? 'block' : 'none'}">${vehicle.id}</div>`
                    : '';

                el.innerHTML = `
                    ${labelHTML}
                    <img src="${iconPath}" alt="Vehicle Icon">
                `;

                markers[vehicle.id] = new mapboxgl.Marker(el)
                    .setLngLat([vehicle.x, vehicle.y])
                    .addTo(map);

                const img = markers[vehicle.id].getElement().querySelector('img');
                img.dataset.scale = mapZoom / vehicleScale;
                img.addEventListener("click", () => startTracking(vehicle));
            } else {
                markers[vehicle.id].setLngLat([vehicle.x, vehicle.y]);
            }

            const img = markers[vehicle.id].getElement().querySelector('img');
            img.dataset.rotation = vehicle.angle;
            img.style.transform = `scale(${img.dataset.scale}) rotate(${vehicle.angle}deg)`;
        });
    });

    function clearAllMarkers() {
        for (let id in markers) {
            markers[id].remove();
        }
        Object.keys(markers).forEach(id => delete markers[id]);
    }

    socket.on('simulationEnded', () => {
        clearAllMarkers();
    });

    document.getElementById("cancel-follow").addEventListener("click", function () {
        tracking = false;
        trackingId = null;
        document.getElementById("tracking-info").textContent = '';
        const statusBar = document.getElementById("tracking-status");
        statusBar.classList.remove('expanded');
        statusBar.classList.add('collapsed');
        map.dragPan.enable();
    });

    function startTracking(vehicle) {
        trackingId = vehicle.id;
        tracking = true;
        document.getElementById("tracking-info").textContent = vehicle.id;
        const statusBar = document.getElementById("tracking-status");
        statusBar.classList.remove('collapsed');
        statusBar.classList.add('expanded');
        map.dragPan.disable();
        map.easeTo({
            center: [vehicle.x, vehicle.y],
            duration: 100
        });
    }

    function updateMarkerSize() {
        const scaleFactor = mapZoom / vehicleScale;
        Object.values(markers).forEach(marker => {
            const img = marker.getElement().querySelector('img');
            img.dataset.scale = scaleFactor;
            img.style.transform = `scale(${scaleFactor}) rotate(${img.dataset.rotation || 0}deg)`;
        });
    }

    map.on('load', () => {
        mapZoom = Math.pow(2, map.getZoom());
        updateMarkerSize();
    });

    map.on('zoom', () => {
        mapZoom = Math.pow(2, map.getZoom());
        updateMarkerSize();
    });

    function changedScale() {
        vehicleScale = 12300 - parseFloat(document.getElementById("scaling").value);
        updateMarkerSize();
    }

    document.getElementById("scaling").addEventListener("input", changedScale);

    document.getElementById("labels-visible").addEventListener("change", function () {
        const showing = this.checked;
        document.querySelectorAll('.vehicle-label').forEach(label => {
            label.style.display = showing ? 'block' : 'none';
        });
    });

    map.dragPan.enable();

    setInterval(() => {
        if (tracking && markers[trackingId]) {
            const lngLat = markers[trackingId].getLngLat();
            map.easeTo({
                center: [lngLat.lng, lngLat.lat],
                duration: 200
            });
        }
    }, 200);
}
