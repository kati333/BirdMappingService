$(document).ready(function(){
	var map = L.map('map').setView([58.610360, 25.657929], 7);
	var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
 	 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		});
            
    map.addLayer(basemap);

    // add map control
	var option_Leaflet = {
			position:'bottomleft', 
			collapsed:false,
		}
    var HM_Control = L.control.layers(null, null, option_Leaflet).addTo(map);

	       
	// $.ajax({
	// 	context: this,
	// 	type: 'GET',
	// 	dataType: "json",
	// 	url: 'data/testdata.json',
	// 	timeout: 15000,
	// 	success: function(data, textStatus, jqXHR){
	// 		create_CF_charts(data);

	// 	},
	// 	error: function(jqXHR, textStatus, errorThrown){
	// 		if (textStatus==='timeout'){
	// 			alert("timeout error");
	// 		}
	// 		else alert(textStatus);
	// 	},
	// });
	
	// windmill parks
    var windmillLayer = L.geoJson();
    var windmillStyle = {
        // "fillColor": "#3e619b",
        // "fillOpacity": .90,
        // "stroke": false
    };
     
    //  Add the building's overlay
    // console.log(document.location.host);
    d3.json('data/tuulepargid.json', function(data) {
    	// console.log(data);
        windmillLayer.addData(data.features).setStyle(windmillStyle);
    });

    HM_Control.addBaseLayer(windmillLayer, "Windmill parks");
    windmillLayer.addTo(map);


	var heat = L.heatLayer([
	    [58.610360, 25.657929, 0.2], 
	    [58.670360, 25.697929, 0.5],
	    [59.4369608,24.7535746, 0.7], 
	    [59.4328379,24.72886, 0.5],
	    [59.4328379,24.72886, 0.7], 
	    [59.4058837,24.6979822, 0.5],
	    [59.4328379,24.72886, 0.7], 
	    [59.4058837,24.6979822, 0.5],
	    [59.4328379,24.72886, 0.7],
	    [59.4058837,24.6979822, 0.5],
	    [59.4328379,24.72886, 0.5],
	    [59.4328379,24.72886, 0.7], 
	    [59.4058837,24.6979822, 0.5],
	    [59.4328379,24.72886, 0.7], 
	    [59.4058837,24.6979822, 0.5],
	    [59.4328379,24.72886, 0.7],
	    

	], {radius: 25}).addTo(map);

	// var axis = d3.svg.axis().orient("up").ticks(4);
	d3.select('#slider').call(d3.slider().axis(true));




	// functions




});

