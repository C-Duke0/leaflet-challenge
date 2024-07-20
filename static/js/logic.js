// Initialize the map
var map = L.map('map').setView([0, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to get color based on earthquake depth
function getColor(d) {
    return d > 500 ? '#800026' :
           d > 400 ? '#BD0026' :
           d > 300 ? '#E31A1C' :
           d > 200 ? '#FC4E2A' :
           d > 100 ? '#FD8D3C' :
                     '#FFEDA0';
}

// Function to get radius based on earthquake magnitude
function getRadius(mag) {
    return mag * 2;
}

// Fetch earthquake data using D3
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson')
    .then(data => {
        // Add GeoJSON data to the map
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: getRadius(feature.properties.mag),
                    fillColor: getColor(feature.geometry.coordinates[2]),
                    color: '#000',
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup('<h3>' + feature.properties.place + '</h3><p>Magnitude: ' 
                                + feature.properties.mag + '</p><p>Depth: ' 
                                + feature.geometry.coordinates[2] + ' km</p><p><a href="' 
                                + feature.properties.url + '" target="_blank">More info</a></p>');
            }
        }).addTo(map);

        // Add legend to the map
        var legend = L.control({position: 'bottomright'});

        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'legend'),
                depths = [0, 100, 200, 300, 400, 500];

            div.innerHTML = '<strong>Depth (km)</strong><br>';
            for (var i = 0; i < depths.length; i++) {
                div.innerHTML +=
                    '<div class="label"><i style="background:' + getColor(depths[i] + 1) + '"></i>' +
                    depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] : '+') + '</div>';
            }
            return div;
        };

        legend.addTo(map);
    })
    .catch(error => console.error('Error fetching earthquake data:', error));
