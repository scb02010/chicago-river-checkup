var mymap = L.map('watermap').setView([41.94, -87.64], 11)

var mytoken = 'pk.eyJ1Ijoic2NiMDIwMTAiLCJhIjoiY2pzM2Y2eHdjMmVuaTQ1bzN6OGE3MnJrYiJ9.5QDjNpLmtS-Y9N3nP2rLdQ'

var lastupdate = 'April 30, 2023'
$('#lastupdate').text(lastupdate);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',{
    id: 'mapbox/light-v10',
    attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    accessToken: mytoken
}).addTo(mymap);

var geojsonMarkerOptions = {
    icon : L.divIcon({ 
        className : 'greycircle',
        iconSize : [ 15, 15 ]})
};

function setupmap() {
    fetch('/sites.json')
    .then(function(response) {
        return response.json();
    })
    .then(function(sites) {
        L.geoJSON(sites, {
            onEachFeature: function(feature, layer) {
                $.getJSON('/readings/' + feature.properties.site_id, function(data) {
                    var quest = data.slice(-1)[0][activeparam]
                    var thedate = data.slice(-1)[0].date.slice(5,16)
                    // only show data if less than 1 month old from last update
                    var date1 = new Date(lastupdate);
                    date1.setMonth(date1.getMonth() - 1)
                    var date2 = new Date(thedate);
                    if (date1 < date2) {
                        layer.setIcon(getIcon(quest));
                    };
                    if (date1 > date2) {
                        layer.setIcon(greyIcon);
                    };
                    layer.bindTooltip('<b>' + feature.properties.name + '</b><br>' 
                    + activeparam + ' was ' + String(quest) + ' on ' + thedate );
                    })
                layer.mytag = "geoJSON",
                layer.on({
                    click: onSiteClick
                })
        },
            pointToLayer: function(feature,latlng) {
                return L.marker(latlng,geojsonMarkerOptions);
            }
        }).addTo(mymap);
        legend.addTo(mymap);
    })
};

function cleanmap() {
    legend.remove(mymap);
    mymap.eachLayer(function (layer) {
        if (layer.mytag == "geoJSON") {
            mymap.removeLayer(layer);
        }
    })
}

setupmap();
    
var names = {}
var siteids = [];
var activeparam = 'ph';
var dataset = [];


var paramcutoffs = {
    ph: {grades: [0,5,6.5,8,9], 
        colors: [
        "rgba(255, 9, 9, 0.6)",
        "rgba(255,255,0,0.6)",
        "rgba(16, 219, 107, 0.6)",
        "rgba(255,255,0,0.6)",
        "rgba(255, 9, 9, 0.6)" 
    ]}, 
    do: {grades: [0, 3, 6],
        colors: [
            "rgba(255, 9, 9, 0.6)",
            "rgba(255,255,0,0.6)",
            "rgba(16, 219, 107, 0.6)"
        ]}, 
    phosphate: {grades: [0, 0.3, 0.6], 
        colors: [
            "rgba(16, 219, 107, 0.6)",
            "rgba(255,255,0,0.6)",
            "rgba(255, 9, 9, 0.6)"
        ]},
    conductivity: {grades: [0,150,500,1600],
        colors: [
            "rgba(255,255,0,0.6)",
            "rgba(16, 219, 107, 0.6)",
            "rgba(255,255,0,0.6)",
            "rgba(255, 9, 9, 0.6)"
    ]},
    tempcelsius: {grades: [0,30], 
        colors: [
            "rgba(16, 219, 107, 0.6)",
            "rgba(255, 9, 9, 0.6)"
        ]}

    }


var legend = L.control({position: 'topright'});

legend.onAdd = function (mymap) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = paramcutoffs[activeparam].grades,
        colors = paramcutoffs[activeparam].colors,
        labels = [],
        from, to;

    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(
            '<i style="background:' + colors[i] + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }

    div.innerHTML = activeparam + '<br>' + labels.join('<br>');
    return div;
};

legend.addTo(mymap);

// color by most recent reading
function getIcon(rating) {
    if (activeparam == 'ph') {
        return rating == null ? greyIcon :
           rating < 5 ? redIcon :
           rating >= 9.0 ? redIcon :
           rating > 8.0 ? yellowIcon :
           rating < 6.5 ? yellowIcon :
           rating == null ? greyIcon :
                        greenIcon;
    }
    if (activeparam == 'do') {
        return rating == null ? greyIcon :
        rating < 3 ? redIcon :
        rating < 6 ? yellowIcon : 
                     greenIcon; 
    }
    if (activeparam == 'conductivity') {
        return  rating == null ? greyIcon :
        rating == '>1990' ? redIcon :
        rating > 1600 ? redIcon :
        rating > 500 ? yellowIcon :
        rating < 150 ? yellowIcon :
                     greenIcon;
    }
    if (activeparam == 'tempcelsius') {
        return rating == null ? greyIcon :
        rating > 30 ? redIcon :
                     greenIcon;
    }
    if (activeparam == 'phosphate') {
        return rating == null ? greyIcon :
        rating >= 0.6 ? redIcon :
        rating >= 0.3 ? yellowIcon :
                    greenIcon;
    }};


var redIcon = L.divIcon({ 
    className : 'redcircle',
    iconSize : [ 15, 15 ]
});
var yellowIcon = L.divIcon({ 
    className : 'yellowcircle',
    iconSize : [ 15, 15 ]
});
var greenIcon = L.divIcon({ 
    className : 'greencircle',
    iconSize : [ 15, 15 ]
});
var greyIcon = L.divIcon({ 
    className : 'greycircle',
    iconSize : [ 15, 15 ]
});

function mostrecent(allsites) {
    allsites.forEach(function(site_id) {
        $.getJSON('/readings/' + site_id, function(data) {
            console.log(data.slice(-1)[0].activeparam) 
        })
    })
};


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
            valueFormatString: "MMM YYYY",
            lineThickness: 0,
            minimum: new Date(2018, 2, 1), 
            maximum: new Date(2023, 6, 1)
        },
        axisY: {
            gridColor: "#D7DBDD",
            gridThickness: 1,
            gridDashType: "solid",
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
        }}
        e.chart.render();
    }

    $("#chartContainer").height('300px');
    $("#chartContainer").CanvasJSChart(options);
};

var paramname = {
    ph: {name: "pH", unit: "", description: 
    "pH indicates the alkalinity or acidity \
    of a substance from 1.0 to 14.0. Acidity increases as the pH gets lower. Changes in acidity can be caused by atmospheric deposition (acid rain), surrounding rock, and \
    certain wastewater discharges. pH affects many chemical and biological processes in the water. The largest variety of aquatic animals prefer a range of 6.5-8.0. pH outside this range stresses \
    the physiological systems of most organisms and can reduce reproduction.",
    range: "6.5-8.0"},
    do: {name: "Dissolved Oxygen", unit: "mg/L", 
    range: ">= 6 mg/L", description:'Dissolved oxygen (DO) is the amount of oxygen that is present in water. Water bodies receive oxygen from the atmosphere and from aquatic plants. Respiration by aquatic animals, decomposition, and various chemical reactions consume oxygen. Sources of oxygen-consuming waste include wastewater from sewage treatment plants, stormwater runoff from farmland or urban streets, feedlots, and failing septic systems.  DO levels fluctuate seasonally and over a 24-hour period. They vary with water temperature and altitude. Cold water holds more oxygen than warm water.  While each organism has its own DO tolerance range, generally, DO levels below 3 milligrams per liter (mg/L) are of concern and waters with levels below 1 mg/L are considered hypoxic and usually devoid of life.'},
    phosphate: {name: "Phosphate", unit: "mg/L", 
    range: "< 0.3 mg/L", description:'Both phosphorus and nitrogen are essential nutrients for the plants and animals that make up the aquatic food web.  A modest increase in phosphorus can, under the right conditions, set off a whole chain of undesirable events in a stream including accelerated plant growth, algae blooms, low dissolved oxygen, and the death of certain fish, invertebrates, and other aquatic animals. There are many sources of phosphorus, both natural and human. These include soil and rocks, wastewater treatment plants, runoff from fertilized lawns and cropland, failing septic systems, runoff from animal manure storage areas, disturbed land areas, drained wetlands, water treatment, and commercial cleaning preparations. In nature, phosphorus usually exists as part of a phosphate molecule (PO4).'},
    conductivity: {name: "Conductivity", unit: "µs/cm", 
    range: "150-500 µs/cm", description:'Conductivity is a measure of the ability of water to pass an electrical current. Because dissolved salts and other inorganic chemicals conduct electrical current, conductivity increases as salinity increases. Conductivity is also affected by temperature: the warmer the water, the higher the conductivity.  Generally, human disturbance tends to increase the amount of dissolved solids entering waters which results in increased conductivity. Conductivity is measured in microsiemens per centimeter (µs/cm). The conductivity of rivers in the United States generally ranges from 50 to 1500 µs/cm. Streams supporting good mixed fisheries have a range between 150 and 500 µs/cm. Conductivity outside this range could indicate that the water is not suitable for certain species of fish or macroinvertebrates.'},
    tempcelsius: {name:"Temperature", unit:"°C", 
    range: "< 30°C", description:'The rates of biological and chemical processes depend on temperature. Aquatic organisms from microbes to fish are dependent on certain temperature ranges for their optimal health. Optimal temperatures for fish depend on the species. Many organisms are unable to survive in temperatures above about 30°C. Causes of temperature change include weather, removal of shading streambank vegetation, impoundments, discharge of cooling water, urban stormwater, and groundwater inflows to the stream. Over time, an area’s climate has the strongest natural influence on a stream’s temperature.'},
}

function onParamButtonClick() {
    $(".side-nav-item.active").removeClass('active');
    $(this).addClass("active");
    activeparam = ($('.side-nav-item.active').attr('id'));
    //console.log($('.side-nav-item.active'));
    cleanmap();
    setupmap();
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
    $("#welcomebox").empty();

    $("#paraminfo").empty();

    $("#paraminfo").append(
        '<h1>' + paramname[activeparam].name + '</h1>'  +
         paramname[activeparam].unit + '<br>'+
         'ideal range: ' + 
         '<font color=#D62246>' + paramname[activeparam].range + '</font>' + '<hr style="height:2px; visibility:hidden;" />' +               
         '<h3>' + paramname[activeparam].description + '</h3>');

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
            // console.log(data.slice(-1)[0]) most recent reading for that site
        })
    });

    function addDays(date, days) {
        // from https://codewithhugo.com/add-date-days-js/
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy
      }

    function addData(data,siteno) {
        let readings = []

        for (let i = 0; i < data.length; i++) {
            mydate = new Date(data[i].date)
            readings.push({
                x: addDays(mydate, 1),
                y: data[i][activeparam]
            });
        }

        addSeries(readings,names[siteno])

    };

    function addSeries(readings, name) {
        const series = {
            type: "spline",
            lineDashType: "solid",
            lineThickness: 0.5,
            connectNullData: true,
            markerSize: 9,
            showInLegend: true,
            dataPoints: readings,
            name: name
        }
        dataset.push(series)
        drawgraph()
    }
};


