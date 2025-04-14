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
    zoom: 11
});

const markers = {};
let vehicleScale = 1300;
let mapZoom = Math.pow(2,11);

const socket = io();
socket.on('update', (vehicles) => {
    vehicles.forEach(vehicle => {
        if (!markers[vehicle.id]) {
            const el = document.createElement('div');
            el.className = 'car-marker';
            el.innerHTML = `<div class="vehicle-label" id="label-${vehicle.id}" style="display: ${document.getElementById("labels-visible").checked? 'block' : 'none'}">${vehicle.id}</div>
                            <img src="/static/bus-icon.png" alt="Car Icon">`;
            markers[vehicle.id] = new mapboxgl.Marker(el)
                .setLngLat([vehicle.x, vehicle.y])
                .addTo(map);
                markers[vehicle.id].getElement().querySelector('img').dataset.scale=mapZoom/vehicleScale;
                
            } else {
            markers[vehicle.id].setLngLat([vehicle.x, vehicle.y]);
        }
        // Rotate the icon to match the vehicle's orientation
        const img = markers[vehicle.id].getElement().querySelector('img');
        img.dataset.rotation = vehicle.angle;
        img.style.transform = `scale(${img.dataset.scale}) rotate(${vehicle.angle}deg)`;
    });
});
function updateMarkerSize() {
    const scaleFactor = mapZoom/vehicleScale;
    Object.values(markers).forEach(marker => {
        const img = marker.getElement().querySelector('img');
        img.dataset.scale=scaleFactor;
        img.style.transform= `scale(${scaleFactor}) rotate(${img.dataset.rotation || 0}deg)`;
    });
}
map.on('load', () => {
    mapZoom=Math.pow(2,map.getZoom());
    updateMarkerSize();
});
map.on('zoom', () => {
    mapZoom=Math.pow(2,map.getZoom());
    updateMarkerSize();
});
function changedScale(){
    vehicleScale=12300-parseFloat(document.getElementById("scaling").value);
    updateMarkerSize()
}
document.getElementById("scaling").addEventListener("input", changedScale);
document.getElementById("labels-visible").addEventListener("change", function() {
    const showing = this.checked;
    document.querySelectorAll('.vehicle-label').forEach(label => {
        label.style.display = showing ? 'block' : 'none';
    });
});
}
