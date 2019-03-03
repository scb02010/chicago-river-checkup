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

//this can be improved...should I be using objects?
var dataPoints = [];
var dataPoints1 = [];
var dataPoints2 = [];
var dataPoints3 = [];
var dataPoints4 = [];
var dataPoints5 = [];
var dataPoints6 = [];
var dataPoints7 = [];
var dataPoints8 = [];
var dataPoints9 = [];
var dataPoints10 = [];
var dataPoints11 = [];
var dataPoints12 = [];
var name0 = "";
var name1 = "";
var name2 = "";
var name3 = "";
var name4 = "";
var name5 = "";
var name6 = "";
var name7 = "";
var name8 = "";
var name9 = "";
var name10 = "";
var name11 = "";
var name12 = "";




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
        data: [{
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints,
            name: name0 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints1,
            name: name1 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints2,
            name: name2 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints3,
            name: name3 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints4,
            name: name4 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints5,
            name: name5 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints6,
            name: name6 || layer.feature.properties.name
        },
        {
            type: "line",
            showInLegend: true,
            dataPoints: dataPoints7,
            name: name7 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints8,
            name: name8 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints9,
            name: name9 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints10,
            name: name10 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints11,
            name: name11 || layer.feature.properties.name
        },
        {
            type: "spline",
            showInLegend: true,
            dataPoints: dataPoints12,
            name: name12 || layer.feature.properties.name
        }
    ]
    };

    function addData(data) {
        if (dataPoints == undefined || dataPoints.length == 0) {
        name0 = layer.feature.properties.name
        for (var i = 0; i < data.length; i++) {
            dataPoints.push({
                x: new Date(data[i].date),
                y: data[i].ph
            });
        }} else if (dataPoints1.length == 0) {
        name1 = layer.feature.properties.name
        for (var i = 0; i < data.length; i++) {
            dataPoints1.push({
                x: new Date(data[i].date),
                y: data[i].ph
            });
        }} else if (dataPoints2.length == 0) {
        name2 = layer.feature.properties.name
        for (var i = 0; i < data.length; i++) {
            dataPoints2.push({
                x: new Date(data[i].date),
                y: data[i].ph
            });
        }} else if (dataPoints3.length == 0) {
        name3 = layer.feature.properties.name
        for (var i = 0; i < data.length; i++) {
            dataPoints3.push({
                x: new Date(data[i].date),
                y: data[i].ph
            });
        }} else if (dataPoints4.length == 0) {
        name4 = layer.feature.properties.name
        for (var i = 0; i < data.length; i++) {
            dataPoints4.push({
                x: new Date(data[i].date),
                y: data[i].ph
            });
        }} else if (dataPoints5.length == 0) {
            name5 = layer.feature.properties.name
            for (var i = 0; i < data.length; i++) {
                dataPoints5.push({
                    x: new Date(data[i].date),
                    y: data[i].ph
                });
        }} else if (dataPoints6.length == 0) {
            name6 = layer.feature.properties.name
            for (var i = 0; i < data.length; i++) {
                dataPoints6.push({
                    x: new Date(data[i].date),
                    y: data[i].ph
                });
        }} else if (dataPoints7.length == 0) {
            name7 = layer.feature.properties.name
            for (var i = 0; i < data.length; i++) {
                dataPoints7.push({
                    x: new Date(data[i].date),
                    y: data[i].ph
                });
        }} else if (dataPoints8.length == 0) {
            name8 = layer.feature.properties.name
            for (var i = 0; i < data.length; i++) {
                dataPoints8.push({
                    x: new Date(data[i].date),
                    y: data[i].ph
                });
        }} else if (dataPoints9.length == 0) {
            name9 = layer.feature.properties.name
            for (var i = 0; i < data.length; i++) {
                dataPoints9.push({
                    x: new Date(data[i].date),
                    y: data[i].ph
                });
        }} else if (dataPoints10.length == 0) {
            name10 = layer.feature.properties.name
            for (var i = 0; i < data.length; i++) {
                dataPoints10.push({
                    x: new Date(data[i].date),
                    y: data[i].ph
                });
        }} else if (dataPoints11.length == 0) {
            name11 = layer.feature.properties.name
            for (var i = 0; i < data.length; i++) {
                dataPoints11.push({
                    x: new Date(data[i].date),
                    y: data[i].ph
                });
        }} else if (dataPoints12.length == 0) {
            name12 = layer.feature.properties.name
            for (var i = 0; i < data.length; i++) {
                dataPoints12.push({
                    x: new Date(data[i].date),
                    y: data[i].ph
                });
            }} else {
            console.log('hello')
        }
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

    makegraph()

};

