var mymap = L.map('watermap').setView([41.89, -87.64], 12)

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
    icon : L.divIcon({ 
        className : 'circle',
        iconSize : [ 15, 15 ]})
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
                return L.marker(latlng, geojsonMarkerOptions).bindTooltip(feature.properties.name);
            }
        }).addTo(mymap);
    })
    
var names = {}
var siteids = [];
var activeparam = 'ph';
var dataset = [];

// parameter selection
$('.side-nav-item').on('click', onParamButtonClick);

function drawgraph() {
    CanvasJS.addColorSet("waterColors",
        [// colorset array
         '#17BEBB',
         '#D62246',
         '#DDDDDD',
         '#212529',
         '#695958'
        ]); 

    let options = {
        zoomEnabled: true,
        panEnabled: true,
        animationEnabled: true,
        backgroundColor: null ,
        colorset: "waterColors",
        // title: {
        //     text: activeparam + " over time",
        //     fontFamily: "tahoma",
        //     fontSize: 26,
        //     fontWeight: "lighter"
        // },
        axisX: {
            valueFormatString: "DD MMM YYYY",
            lineThickness: 0,
        },
        axisY: {
            gridColor: "darkgrey",
            gridThickness: 1,
            gridDashType: "dash",
            lineThickness: 0,
            //title: paramname[activeparam],
            //titlefontFamily: "tahoma",
            //titlefontWeight: "lighter",
            //titleFontSize: 20,
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
                siteids.splice(siteids.indexOf(Number(sitetoremove)),1);
                // now just figure out how to remove that one
        }}
        e.chart.render();
    }

    $("#chartContainer").CanvasJSChart(options);
};

var param = {
    ph: {good: 5, bad: 6}, 
    do: {good: 8, bad: 8}, 
    phosphate: {good: 8, bad: 9},
    conductivity: {good: 10, bad: 9},
    tempcelsius: {good: 12, bad: 12}}

var paramname = {
    ph: {name: "pH", unit: "", description: 
    "pH indicates the alkalinity or acidity \
    of a substance from 1.0 to 14.0. Acidity increases as the pH gets lower. Changes in acidity can be caused by atmospheric deposition (acid rain), surrounding rock, and \
    certain wastewater discharges. pH affects many chemical and biological processes in the water. The largest variety of aquatic animals prefer a range of 6.5-8.0. pH outside this range stresses \
    athe physiological systems of most organisms and can reduce reproduction.",
    range: "6.5-8.0"},
    do: {name: "Dissolved Oxygen", unit: "mg/L", range: ">= 3 mg/L", description:'Dissolved oxygen (DO) is the amount of oxygen that is present in water. Water bodies receive oxygen from the atmosphere and from aquatic plants. Respiration by aquatic animals, decomposition, and various chemical reactions consume oxygen. Sources of oxygen-consuming waste include wastewater from sewage treatment plants, stormwater runoff from farmland or urban streets, feedlots, and failing septic systems.  DO levels fluctuate seasonally and over a 24-hour period. They vary with water temperature and altitude. Cold water holds more oxygen than warm water.  While each organism has its own DO tolerance range, generally, DO levels below 3 milligrams per liter (mg/L) are of concern and waters with levels below 1 mg/L are considered hypoxic and usually devoid of life.'},
    phosphate: {name: "Phosphate", unit: "mg/L", description:'a'},
    conductivity: {name: "Conductivity", unit: "µs/cm", description:'a'},
    tempcelsius: {name:"Temperature", unit:"°C", range: "<= 30°C", description:'The rates of biological and chemical processes depend on temperature. Aquatic organisms from microbes to fish are dependent on certain temperature ranges for their optimal health. Optimal temperatures for fish depend on the species. Many organisms are unable to survive in temperatures above about 30°C. Causes of temperature change include weather, removal of shading streambank vegetation, impoundments, discharge of cooling water, urban stormwater, and groundwater inflows to the stream. Over time, an area’s climate has the strongest natural influence on a stream’s temperature.'},
}

function onParamButtonClick() {
    $(".side-nav-item.nav-link.active").removeClass('active');
    $(this).addClass("active");
    activeparam = ($('.side-nav-item.active').attr('id'));
    dataset = [];

    if (siteids.length > 0) {
    updateData(siteids);

    $(function () {
          $("#paraminfo").empty();
          $("#paraminfo").append(
              '<h1>' + paramname[activeparam].name + '</h1>'  +
               paramname[activeparam].unit + '<br>'+
               'ideal range: ' + 
               '<font color=#D62246>' + paramname[activeparam].range + '</font>' + '<hr style="height:2px; visibility:hidden;" />' +               
               '<h3>' + paramname[activeparam].description + '</h3>')
        });
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

// readings must be sorted by date
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


