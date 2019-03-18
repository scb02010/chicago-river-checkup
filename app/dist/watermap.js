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
                    click: onSiteClick
                });
        },
            pointToLayer: function(feature,latlng) {
                return L.circleMarker(latlng, geojsonMarkerOptions);
            }
        }).addTo(mymap);
    })
    
var names = {}
var siteids = [];
var activeparam = 'ph';
var dataset = [];

// parameter selection
$('.btn').on('click', onParamButtonClick);

function drawgraph() {

    let options = {
        zoomEnabled: true,
        panEnabled: true,
        animationEnabled: true,
        theme: "light2",
        title: {
            text: activeparam + " over time"
        },
        axisX: {
            valueFormatString: "DD MMM YYYY",
        },
        axisY: {
            title: activeparam,
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
            itemclick: removeSeries
        },
        data: dataset
    };

    function removeSeries(e){
        for (let i = 0; i< (e.chart.data).length; i++) {
            if (e.chart.data[i].name == e.dataSeries.name) {
                e.chart.data[i].remove();
                let sitetoremove = Object.keys(names).find(key => names[key] === (e.dataSeries.name))
                console.log(sitetoremove);
                console.log(siteids);
                // now just figure out how to remove that one
        }}
        e.chart.render();
    }

    $("#chartContainer").CanvasJSChart(options);
};


function onParamButtonClick() {
    $(".btn-group").find(".active").removeClass("active");
    $(this).addClass("active");
    activeparam = ($('.active').attr('id'));

    dataset = [];

    if (siteids.length > 0) {
    updateData(siteids);
    }
};

function onSiteClick(e) {
    var layer = e.target; 

    if (siteids.includes(layer.feature.properties.site_id)) {
        console.log('already in')
    } else {
        siteids.push(layer.feature.properties.site_id)
        updateData([layer.feature.properties.site_id]);
        names[layer.feature.properties.site_id] = layer.feature.properties.name;
}
};

function updateData(toUpdate) {
    toUpdate.forEach(function(site_id) {
        $.getJSON('/readings/' + site_id, function(data) {
            addData(data,site_id)
        })
    });

    function addData(data,siteno) {
        let readings = []

        for (let i = 0; i < data.length; i++) {
            readings.push({
                x: new Date(data[i].date),
                y: data[i][activeparam]
            });
        }

        addSeries(readings,names[siteno])

    };

    function addSeries(readings, name) {
        const series = {
            type: "spline",
            showInLegend: true,
            dataPoints: readings,
            name: name
        }
        dataset.push(series)
        drawgraph()
    }
};


