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

    var observationData;

    var options_heatmap = {
		minOpacity: 0.0,
		maxzoom: 16,
		radius: 10,
		blur: 15,
		 // larger scale radius 20 and blur 25, zoom 16. 
		// gradient: { .1:"#e0f3db",.4:"#3dcee3",.6:"#7bccc4",.8:"#4eb3d3",.8:"#2b8cbe",.9:"#0868ac",1:"#084081" }
		// gradient: { .2:"#7bccc4",.3:"#e0f3db", .9:"#2b8cbe", 1:"#0a222e" }
		gradient: { .2:"#7bccc4",.9:"#e0f3db", 1:"#2b8cbe" }
		// gradient: { .2:"#7bccc4",.3:"#80cdc1", 1:"#018571" }
	};

	       
	// $.ajax({
	// 	context: this,
	// 	type: 'GET',
	// 	dataType: "json",
	// 	url: 'data/testdata.json',
	// 	timeout: 15000,
	// 	success: function(data, textStatus, jqXHR){
	// 		o
	// 	},
	// 	error: function(jqXHR, textStatus, errorThrown){
	// 		if (textStatus==='timeout'){
	// 			alert("timeout error");
	// 		}
	// 		else alert(textStatus);
	// 	},
	// });


	
	// windmill parks
    var windmillLayer;
    var windmillStyle = {
        // "fillColor": "#3e619b",
        // "fillOpacity": .90,
        // "stroke": false
    };
    var my_json;
    //  Add the building's overlay
    d3.json('data/tuulepargid.json', function(data) {
    	my_json = L.geoJson(data.features, {
    	    pointToLayer: function(feature, latlng) {
				 var smallIcon = new L.Icon({
				     iconSize: [15, 15],
				     iconAnchor: [0, 0],
				     iconUrl: 'images/windmill.png'
				 });
                return L.marker(latlng, {icon: smallIcon});
            },
    	});


	    my_json.addTo(map)

        
    });
	// windmillLayer.addData(data.features).setStyle(windmillStyle);
    // HM_Control.addBaseLayer(windmillLayer, "Windmill parks");
    HM_Control.addOverlay(windmillLayer, "Windmill parks");
    // windmillLayer.addTo(map);


	// var heat = L.heatLayer([
	//     [58.610360, 25.657929, 0.2], 
	//     [58.670360, 25.697929, 0.5],
	//     [59.4369608,24.7535746, 0.7], 
	//     [59.4328379,24.72886, 0.5],
	//     [59.4328379,24.72886, 0.7], 
	//     [59.4058837,24.6979822, 0.5],
	//     [59.4328379,24.72886, 0.7], 
	//     [59.4058837,24.6979822, 0.5],
	//     [59.4328379,24.72886, 0.7],
	//     [59.4058837,24.6979822, 0.5],
	//     [59.4328379,24.72886, 0.5],
	//     [59.4328379,24.72886, 0.7], 
	//     [59.4058837,24.6979822, 0.5],
	//     [59.4328379,24.72886, 0.7], 
	//     [59.4058837,24.6979822, 0.5],
	//     [59.4328379,24.72886, 0.7],
	    

	// ], {radius: 25}).addTo(map);
	
		// var startValString = data.startTime.getUTCDay() +"." + data.startTime.getUTCMonth() + "." + data.startTime.getUTCFullYear() + " " + data.startTime.getUTCHours() + ":" + data.startTime.getUTCMinutes();
         // var endValString = start.endTime.getUTCFullYear();

	

	// var axis = d3.svg.axis().orient("up").ticks(4);
	var timeSlider;
	d3.select('#slider').call(d3.slider().axis(true).min(0).max(150).step(15)
		.on("slide", function(evt, value){
			//console.log(evt);
			console.log(value);
			$('#daterange').html("<i>" + value + "</i>");
		}
	));




	$.ajax({
		context: this,
		type: 'GET',
		dataType: "json",
		url: 'data/observations.json',
		timeout: 15000,
		success: function(data, textStatus, jqXHR){
			showObservationHeatmap(data,options_heatmap);

		},
		error: function(jqXHR, textStatus, errorThrown){
			if (textStatus==='timeout'){
				alert("timeout error");
			}
			else alert(textStatus);
		},
	});



	// functions
	
	function showObservationHeatmap(data) {
		console.log(data);
		var coords = data.adj_coords;
		var c2 = [];
		for(var i = 0; i<1300; i++) {
			var t  = coords[i][0];
			coords[i][0]=coords[i][1];
			coords[i][1]=t;
			coords[i].push(0.9);
			c2.push(coords[i]);
		}
		// var coords = [[24.102625450014713, 59.2957067310101, 1.0], [26.34645939, 57.91454990, 1.0]];

		// for (var i = 0 ; i < coords.length; i++) {

		// }

		var heat2 = L.heatLayer(c2, {radius: 25});
map.addLayer(heat2);
    HM_Control.addOverlay(heat2, "Manual bird observations");

	}


});

