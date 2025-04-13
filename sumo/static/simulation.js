getMapboxToken();
async function getMapboxToken() {
    try {
        const response = await fetch('http://localhost:8080/api/mapbox-token');
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

function initializeMap(){
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-111.692020, 40.296440], // Initialize with a central point
    zoom: 9
});

const markers = {};

const socket = io();
socket.on('update', (vehicles) => {
    vehicles.forEach(vehicle => {
        if (!markers[vehicle.id]) {
            const el = document.createElement('div');
            el.className = 'car-marker';
            el.innerHTML = `<img src="/static/bus-icon.png" alt="Car Icon">`;
            markers[vehicle.id] = new mapboxgl.Marker(el)
                .setLngLat([vehicle.x, vehicle.y])
                .addTo(map);
        } else {
            markers[vehicle.id].setLngLat([vehicle.x, vehicle.y]);
        }
        // Rotate the icon to match the vehicle's orientation
        const img = markers[vehicle.id].getElement().querySelector('img');
        img.style.transform = `rotate(${vehicle.angle}deg)`;
    });
});
function updateMarkerSize() {
    console.log("setting markers");
    const zoom = map.getZoom();
    const baseWidth = 8;
    const baseHeight = 18;
    const scaleFactor = zoom / 9;
    const newWidth = baseWidth * scaleFactor;
    const newHeight = baseHeight * scaleFactor;

    Object.values(markers).forEach(marker => {
        const img = marker.getElement().querySelector('img');
        img.style.width = `${newWidth}px`;
        img.style.height = `${newHeight}px`;
    });
}
map.on('load', () => {
    updateMarkerSize();
});
map.on('zoom', () => {
    updateMarkerSize();
});
}