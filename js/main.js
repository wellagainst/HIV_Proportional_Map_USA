/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
var minValue;
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [0, 0],
        zoom: 2
    });

    //add OSM base tilelayer
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'
    }).addTo(map);

    var marker = L.marker([43.075850, -89.401556]).addTo(map);
    var circle = L.circle([43.088988, -89.416372], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,    radius: 500
    }).addTo(map);
    
    var polygon = L.polygon([
        [43.076214, -89.384191],
        [43.073181, -89.386228],
        [43.074638, -89.382195]
    ]).addTo(map);

    marker.bindPopup("<strong>Geog575!</strong><br />This course is so challenging.").openPopup();
    circle.bindPopup("And it takes so much time.");
    polygon.bindPopup("Don't be upset if you don't understand some concepts.");

    var popup = L.popup()
    .setLatLng([43.070585, -89.398706])
    .setContent("Think twice before taking this course.")
    .openOn(map);
    
    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    }

    map.on('click', onMapClick);

    //call getData function
    getData(map);
};


function calculateMinValue(data){
    //create empty array to store all data values
    var allValues = [];
    //loop through each state
    for(var state of data.features){
        //loop through each year
        for(var year = 2015; year <= 2019; year+=1){
              //get HIV Diagnoses rate for current year
              var value = state.properties["NewDiagnosesStateRate"+ String(year)];
              //add value to array
              allValues.push(value);
        }
    }
    //get minimum value of our array
    var minValue = Math.min(...allValues)
    
    return minValue;
}


//calculate the radius of each proportional symbol
function calcPropRadius(attValue) {
    //constant factor adjusts symbol sizes evenly
    var minRadius = 5;
    //Flannery Apperance Compensation formula
    var radius = 1.0083 * Math.pow(attValue/minValue,0.5715) * minRadius
    
    return radius;
};

//Step 3: Add circle markers for point features to the map
function createPropSymbols(data){

    //Step 4: Determine which attribute to visualize with proportional symbols
    var attribute = "NewDiagnosesStateRate2019";

    //create marker options
    var geojsonMarkerOptions = {
        fillColor: "#ff7800",
        color: "#fff",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8,
        radius: 8
    };

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            //Step 5: For each feature, determine its value for the selected attribute
            var attValue = Number(feature.properties[attribute]);
            
            //Step 6: Give each feature's circle marker a radius based on its attribute value
            geojsonMarkerOptions.radius = calcPropRadius(attValue);

            //create circle markers
            return L.circleMarker(latlng, geojsonMarkerOptions);
            
        }
    }).addTo(map);
};

//function to retrieve the data and place it on the map

function getData(){
    //load the data
    fetch("data/AIDSDiagnosesRate1519.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //calculate minimum data value
            minValue = calculateMinValue(json);
            
            //call function to create proportional symbols
            createPropSymbols(json);
            
        })
};

document.addEventListener('DOMContentLoaded',createMap)