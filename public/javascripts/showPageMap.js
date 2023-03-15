
mapboxgl.accessToken = mapToken;

console.log(`what is: ${mapToken}`);

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: hike.geometry.coordinates, // starting position [lng, lat]
    zoom: 10 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(hike.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
            .setHTML(
                `<h3>${hike.title}</h3><p>${hike.location}</p>`
            )
    )
    .addTo(map)
