//var map = L.map('map', {
    //center: [47.609179, -122.337693],
    //zoom: 13
//});

//L.geoJSON(map).addTo(mymap);



var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Nicholas Recreation Center",
        "amenity": "Recreation Center",
        "popupContent": "This is where Badgers play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [43.070370, -89.398310]
    }
};

L.geoJSON(geojsonFeature).addTo(map);


var myLines = [{
    "type": "LineString",
    "coordinates": [[43.073215, -89.394004], [43.073336, -89.409089], [43.067765, -89.409034]]
}, {
    "type": "LineString",
    "coordinates": [[43.073215, -89.386269], [43.067204, -89.394881], [43.067605, -89.397350]]
}];

var myStyle = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.65
};

L.geoJSON(myLines, {
    style: myStyle
}).addTo(map);

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
};

L.geoJSON(someGeojsonFeature, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    }
}).addTo(map);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "UW Hospital",
        "amenity": "University Hospital",
        "popupContent": "This is where people get cured!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [43.076230, -89.432344]
    }
};

L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);

var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Wisconsin State Capitol",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [43.074354, -89.384284]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Madison Sourdough",
        "show_on_map": false
    },
    "geometry": {
        "type": "Point",
        "coordinates": [43.079773, -89.369686]
    }
}];

L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);