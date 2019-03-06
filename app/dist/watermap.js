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
                layer.on({
                    click: drawgraph
                });
        },
            pointToLayer: function(feature,latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(mymap);
    })

var siteids = [];


var dataset = [];

function drawgraph(e) {
    var layer = e.target;

    var options = {
        animationEnabled: true,
        theme: "light2",
        title: {
            text: "pH over time"
        },
        axisX: {
            valueFormatString: "DD MMM YYYY",
        },
        axisY: {
            title: "pH",
            titleFontSize: 24,
            includeZero: false
        },
        toolTip: {
            shared:true
        },
        legend: {
            cursor: "pointer",
            verticalAlign: "top",
            horizontalAlign: "right",
            dockInsidePlotArea: false,
            itemclick: toggleDataSeries
        },
        data: dataset
    };

    function addData(data) {
        let series = []

        for (let i = 0; i < data.length; i++) {
            series.push({
                x: new Date(data[i].date),
                y: data[i].ph
            });
        }
        addSeries(series,layer.feature.properties.name)

        // old get reading portion
        var ph = data[0]['ph'];
        var date = data[0]['date'];
        L.popup().setLatLng(e.latlng)
            .setContent('ph for ' + date + ': ' + ph)
            .openOn(mymap);
        //end get reading
        $("#chartContainer").CanvasJSChart(options);
    
    }
    
    function toggleDataSeries(e){
        if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else{
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    function makegraph() {
        if (siteids.includes(layer.feature.properties.site_id)) {
            console.log('already in')
        } else {
            siteids.push(layer.feature.properties.site_id)
            $.getJSON('/readings/' + layer.feature.properties.site_id, addData);
    }}

    function addSeries(readings, name) {
        const series = {
            type: "spline",
            showInLegend: true,
            dataPoints: readings,
            name: name
        }
        dataset.push(series)
    }

    makegraph()

};
