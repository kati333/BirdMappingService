$(document).ready(function(){
	var map = L.map('map').setView([58.610360, 25.657929], 7);
	var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
 	 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		});
            
    map.addLayer(basemap);
    // option for the heatmap

	// options for heatmap
    var options_manualObs = {
		minOpacity: 0.7,
		maxzoom: 16,
		radius: 5,
		blur: 15,
		 // larger scale radius 20 and blur 25, zoom 16. 
		gradient: { .6:"#7bccc4",.7:"#4eb3d3",.8:"#2b8cbe",.9:"#0868ac",1:"#084081" }
		// gradient: { .7:"#7bccc4",.8:"#e0f3db", .9:"#2b8cbe", 1:"#0a222e" }
		// gradient: { .7:"#7bccc4",.9:"#e0f3db", 1:"#2b8cbe" }
		// gradient: { .2:"#7bccc4",.3:"#80cdc1", 1:"#018571" }
	};

    // add map control
	var option_Leaflet = {
			position:'bottomleft', 
			collapsed:false,
		}
    var HM_Control = L.control.layers(null, null, option_Leaflet).addTo(map);

    var observationData;

    var my_json;

    d3.json('data/tuulepargid.json', function(data) {
    	my_json = L.geoJson(data.features, {
    	    pointToLayer: function(feature, latlng) {
    	    	 var myAngle = 45;
				 var smallIcon = new L.Icon({
				     iconSize: [20, 20],
				     iconAnchor: [0, 0],
				     iconUrl: 'images/windmill5_4.png'
				 });
                return L.marker(latlng, {icon: smallIcon});
            },
    	});

    	HM_Control.addOverlay(my_json, "Windmill parks");
	    my_json.addTo(map)
    });

	$.ajax({
		context: this,
		type: 'GET',
		dataType: "json",
		url: 'data/data.geojson',
		timeout: 15000,
		success: function(data, textStatus, jqXHR){
			showObservationHeatmap(data);


		},
		error: function(jqXHR, textStatus, errorThrown){
			if (textStatus==='timeout'){
				alert("timeout error");
			}
			else alert(textStatus);
		},
	});
	// var axis = d3.svg.axis().orient("up").ticks(4);
	var timeSlider, preValue;
	preValue = 0;
	d3.select('#slider').call(d3.slider().axis(true).min(0).max(150).step(15)
		.on("slide", function(evt, value){
			// console.log(evt);
			console.log(value);

			var filterData;

			if(value !== preValue){
				updateObservationHeatmap(data);
				preValue = value;
			}
			filterData = filterObservations(value,data);
			updateObservationHeatmap(filterData);

			$('#daterange').html("<i>" + value + "</i>");
		}
	));






	
	// functions
	function filterObservations(value,data){

	}

	function updateObservationHeatmap(data){

	}

	function showObservationHeatmap(data) {
		console.log(data);
		var coords = data.features;
		console.log(coords);

		var coordList = [];

		for(var i=0; i < coords.length; i++){
			var t = coords[i];
			var point = t["geometry"]["coordinates"];
			point.push(0.8);
			coordList.push(point);
		}




		// var coords = data.adj_coords;
		// var c2 = [];
		// for(var i = 0; i<1300; i++) {
		// 	var t  = coords[i][0];
		// 	coords[i][0]=coords[i][1];
		// 	coords[i][1]=t;
		// 	coords[i].push(0.9);
		// 	c2.push(coords[i]);
		// }

		var heat2 = L.heatLayer(coordList,options_manualObs);
		map.addLayer(heat2);

		// map.addData(geojsonFeature);

    	HM_Control.addOverlay(heat2, "Manual bird observations");

	}


});

