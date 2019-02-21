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

fetch('/sites.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(sites) {
        L.geoJSON(sites, {
            onEachFeature: function(feature, layer) {
                layer.bindTooltip(feature.properties.name);
                layer.on('mouseover',function() {layer.openTooltip(); });
                layer.on('mouseout',function() {layer.closeTooltip(); });
        },
            pointToLayer: function(feature,latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(mymap);
    })


// function featureJoinByProperty(fProps, dTable, joinKey) {
//     var keyVal = fProps[joinKey];
//     var match = {};
//     for (var i = 0; i < dTable.length; i++) {
//         if (dTable[i][joinKey] == keyVal) {
//             match = dTable[i];
//             for (key in match) {
//                 if (!(key in fProps)) {
//                     fProps[key] = match[key];
//                 }
//             }
//         }
//     }
// }

// samplingsites.eachLayer(function (layer) {
//     featureJoinByProperty(layer.feature.properties, data, 'site_id');
//     console.log(layer.feature.properties.ph);
// });

// // how do i perform operations on a selection/use the joined data to populate the tooltip?