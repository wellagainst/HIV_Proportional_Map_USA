/* Map of GeoJSON data from MegaCities.geojson */
//declare map var in global scope
var map;
var minValue;
//function to instantiate the Leaflet map
function createMap(){
    //create the map
    map = L.map('map', {
        center: [40, -99],
        zoom: 3
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
              var value = state.properties["NewDiagnosesStateRate_"+ String(year)];
              
              
              //add value to array
              allValues.push(value);
    
        }
    }
    console.log(allValues)
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


//function to convert markers to circle markers
function pointToLayer(feature, latlng, attributes){
    
    //Determine which attribute to visualize with proportional symbols
    var attribute = attributes[0];
    //check
    console.log(attribute);

    //create marker options
    var options = {
        fillColor: "#ff7800",
        color: "#000",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
    };

    //For each feature, determine its value for the selected attribute
    var attValue = Number(feature.properties[attribute]);
    
    //Give each feature's circle marker a radius based on its attribute value
    options.radius = calcPropRadius(attValue);
    
    //create circle marker layer
    var layer = L.circleMarker(latlng, options);

    //build popup content string
    var popupContent = "<p><b>State:</b> " + feature.properties.State + "</p>";
    var year = attribute.split("_")[1];
    popupContent += "<p><b>HIV newly diagnoses rate in " + year + ":</b> " + feature.properties[attribute] + " %</p>";
    //bind the popup to the circle marker
    layer.bindPopup(popupContent,{
        offset: new L.Point(0,-options.radius) 
    });
    
    //return the circle marker to the L.geoJson pointToLayer option
    return layer;
};

//Add circle markers for point features to the map
function createPropSymbols(data, attributes){
    
    //create a Leaflet GeoJSON layer and add it to the map
    L.geoJson(data, {
        pointToLayer: function(feature, latlng){
            return pointToLayer(feature, latlng, attributes);
        }
        
    }).addTo(map);
};


//Step 1: Create new sequence controls
function createSequenceControls(attributes){
    //create range input element (slider)
    var slider = "<input class='range-slider' type='range'></input>";
    document.querySelector("#panel").insertAdjacentHTML('beforeend',slider);
    //set slider attributes
    document.querySelector(".range-slider").max = 4;
    document.querySelector(".range-slider").min = 0;
    document.querySelector(".range-slider").value = 0;
    document.querySelector(".range-slider").step = 1;
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="reverse">Reverse</button>');
    document.querySelector('#panel').insertAdjacentHTML('beforeend','<button class="step" id="forward">Forward</button>');
    
    //Step 5: click listener for buttons
    document.querySelectorAll('.step').forEach(function(step){
        step.addEventListener("click", function(){
            var index = document.querySelector('.range-slider').value;

            //Step 6: increment or decrement depending on button clicked
            if (step.id == 'forward'){
                index++;
                //Step 7: if past the last attribute, wrap around to first attribute
                index = index > 4 ? 0 : index;
            } else if (step.id == 'reverse'){
                index--;
                //Step 7: if past the first attribute, wrap around to last attribute
                index = index < 0 ? 4 : index;
            };

            //Step 8: update slider
            document.querySelector('.range-slider').value = index;
            updatePropSymbols(attributes[index]);
        })
        
    })
    


    //Step 5: input listener for slider
    document.querySelector('.range-slider').addEventListener('input', function(){            
        //Step 6: get the new index value
        var index = this.value;
        //console.log(index)
        updatePropSymbols(attributes[index]);
    });
    
    
    
};


function updatePropSymbols(attribute){
    map.eachLayer(function(layer){
        if (layer.feature && layer.feature.properties[attribute]){
            //access feature properties
            var props = layer.feature.properties;

            //update each feature's radius based on new attribute values
            var radius = calcPropRadius(props[attribute]);
            layer.setRadius(radius);

            //add city to popup content string
            var popupContent = "<p><b>State:</b> " + props.State + "</p>";

            //add formatted attribute to panel content string
            var year = attribute.split("_")[1];
            popupContent += "<p><b>HIV newly diagnoses rate in " + year + ":</b> " + props[attribute] + " %</p>";

            //update popup content            
            popup = layer.getPopup();            
            popup.setContent(popupContent).update();
        };
    });
};


function processData(data){
    //empty array to hold attributes
    var attributes = [];

    //properties of the first feature in the dataset
    var properties = data.features[0].properties;

    //push each attribute name into attributes array
    for (var attribute in properties){
        //only take attributes with population values
        if (attribute.indexOf("NewDiagnosesStateRate") > -1){
            attributes.push(attribute);
        };
    };

    //check result
    console.log(attributes);

    return attributes;
};

//function to retrieve the data and place it on the map
function getData(){
    //load the data
    fetch("data/HIVDiagnosesRate1519.geojson")
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            var attributes = processData(json);
            //calculate minimum data value
            minValue = calculateMinValue(json);
            //call function to create proportional symbols
            createPropSymbols(json, attributes);
            createSequenceControls(attributes);
        })
};

document.addEventListener('DOMContentLoaded',createMap)