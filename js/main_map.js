$(document).ready(function(){
	var map = L.map('map').setView([58.610360, 25.657929], 7);
	var basemap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png', {
 	 attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
		});
            
    map.addLayer(basemap);
    // option for the heatmap

	// options for heatmap
    var options_manualObs = {
		minOpacity: .7,
		maxzoom: 16,
		radius: 12,
		blur: 15,
		 // larger scale radius 20 and blur 25, zoom 16. 
		// gradient: { .6:"#7bccc4",.7:"#4eb3d3",.8:"#2b8cbe",.9:"#0868ac",1:"#084081" }
		 // gradient: { .7:"#7bccc4",.8:"#e0f3db", .9:"#bd0026", 1:"#bd0026" } 
		//gradient: { 0.1:'blue', 1:'blue'}
		gradient: { .2:"#4393c3", 1:"#053061" } 
		// gradient: { .7:"#7bccc4",.9:"#e0f3db", 1:"#2b8cbe" }
		// gradient: { .2:"#7bccc4",.3:"#80cdc1", 1:"#018571" }
	};

    var options_radarObs = {
		minOpacity: 1,
		maxzoom: 16,
		radius: 1,
		blur: 1,
		 // larger scale radius 20 and blur 25, zoom 16. 
		// gradient: { .6:"#7bccc4",.7:"#4eb3d3",.8:"#bd0026",.9:"#bd0026",1:"#bd0026" }
		gradient: { 0.1:'red', 1:'red'}
		// gradient: {1:""}
		// gradient: { .7:"#7bccc4",.8:"#e0f3db", .9:"#2b8cbe", 1:"#0a222e" }
		// gradient: { .7:"#7bccc4",.9:"#e0f3db", 1:"#2b8cbe" }
		// gradient: { .7:"#7bccc4",.8:"#e0f3db", .9:"#bd0026", 1:"#bd0026" } 
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
				     iconSize: [14, 14],
				     iconAnchor: [0, 0],
				     iconUrl: 'images/windmill5_6.png'
				 });
                return L.marker(latlng, {icon: smallIcon});
            },
    	});

    	HM_Control.addOverlay(my_json, "<span class='legend_windmill'>Windfarms  <img src='images/windmill5_6.png' width='20px' heigh='20px' /></span>");
	    my_json.addTo(map)
    });

	var observationData,radarData;
	
	
	$.ajax({
		context: this,
		type: 'GET',
		dataType: "json",
		url: 'data/data.geojson',
		timeout: 15000,
		success: function(data, textStatus, jqXHR){
			observationData = data;
			showObservationHeatmap(data,18);


		},
		error: function(jqXHR, textStatus, errorThrown){
			if (textStatus==='timeout'){
				alert("timeout error");
			}
			else alert(textStatus);
		},
	});

	$.ajax({
		context: this,
		type: 'GET',
		dataType: "json",
		url: 'data/testdata.geojson',
		timeout: 15000,
		success: function(data, textStatus, jqXHR){
			radarData = data;
			showRadarHeatmap(data,18);


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
	var tickFormatter = function(d){
		return ;
	}

	d3.select('#slider').call(d3.slider().axis(true).min(18).max(43).step(1).margin(20)
		.on("slide", function(evt, value){
			// console.log(evt);
			console.log(value);

			//var filterData;

			// if(value !== preValue){
				// updateObservationHeatmap(data);
				// preValue = value;
			// }
			//filterData = filterObservations(value,data);
			//updateObservationHeatmap(filterData);
			
			showObservationHeatmap(observationData, value + "");
			showRadarHeatmap(radarData, value + "");
			$('#daterange').html("" + value + "");
		}
	));






/* 	function weekFilter(feature,value){
		if(feature.properties.week == value) return true
	} */
	
	// functions
	
	var heat2;
	function showObservationHeatmap(data,week) {
		console.log("Rendering" + week);
		var coords = data.features;
		//console.log(coords);

		var coordList = [];

		for(var i=0; i < coords.length; i++){
			var t = coords[i];
			if(t["properties"]["week"] != week) continue;
				var point = t["geometry"]["coordinates"];
			point.push(0.8);
			coordList.push(point);
		}
    
      if (!heat2) {
        heat2 = L.heatLayer(coordList,options_manualObs);
        map.addLayer(heat2);
        HM_Control.addOverlay(heat2, "<span class='legend_manual'>Manual bird observations</span>");
      }
      else {
        heat2.setLatLngs(coordList);
      }
	}



	var heat3;
	function showRadarHeatmap(data,week) {
		console.log("Rendering radar" + week);
		var coords = data.features;
		//console.log(coords);

		var coordList = [];

		for(var i=0; i < coords.length; i++){
			var t = coords[i];
			if(t["properties"]["week"] != week) continue;
				var point = t["geometry"]["coordinates"];
			point.push(0.8);
			coordList.push(point);
		}
		    
      if (!heat3) {
        heat3 = L.heatLayer(coordList,options_radarObs);
        map.addLayer(heat3);
        HM_Control.addOverlay(heat3, "<span class='legend_radar'>Radar bird observations</span>");
      }
      else {
        heat3.setLatLngs(coordList);
      }
	}

});

