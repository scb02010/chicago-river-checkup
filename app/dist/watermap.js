var mymap = L.map('watermap').setView([41.945266, -87.669750], 10)

var mytoken = 'pk.eyJ1Ijoic2NiMDIwMTAiLCJhIjoiY2pzM2Y2eHdjMmVuaTQ1bzN6OGE3MnJrYiJ9.5QDjNpLmtS-Y9N3nP2rLdQ'

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',{
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: mytoken, 
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
}).addTo(mymap);


var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800:",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

function getreading(e) {
    var layer = e.target;

    fetch('/' + layer.feature.properties.site_id)
    .then(function(response) {
        return response.json();
    }).then(function(data) {
        var ph = data[0]['ph'];
        var date = data[0]['date'];
        L.popup().setLatLng(e.latlng)
            .setContent('ph for ' + date + ': ' + ph)
            .openOn(mymap);
    });
}

fetch('/sites.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(sites) {
        L.geoJSON(sites, {
            onEachFeature: function(feature, layer) {
                layer.on({
                    click: getreading
                });
        },
            pointToLayer: function(feature,latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(mymap);
    })