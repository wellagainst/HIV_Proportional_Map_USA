/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [20, 0],
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
    getData();
};





function onEachFeature(feature, layer) {
    //no property named popupContent; instead, create html string with all properties
    var popupContent = "";
    if (feature.properties) {
        //loop to add feature property names and values to html string
        for (var property in feature.properties){
            popupContent += "<p>" + property + ": " + feature.properties[property] + "</p>";
        }
        layer.bindPopup(popupContent);
    };
};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("data/AIDSDiagnosesRate1519.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create marker options
            var geojsonMarkerOptions = {
                radius: 6,
                fillColor: "#3182bd",
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            
            //create a Leaflet GeoJSON layer and add it to the map
            L.geoJson(json, {
                onEachFeature: onEachFeature,
                pointToLayer: function(feature, latlng){
                    return L.circleMarker(latlng, geojsonMarkerOptions);
                }
                
            }).addTo(map);

        });
        
};

document.addEventListener('DOMContentLoaded',createMap)