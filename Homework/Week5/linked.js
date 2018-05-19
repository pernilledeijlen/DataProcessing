/*
* Pernille Deijlen
* 10747354
* Linked Views with Javascript using d3 version 3
* credits to datamaps on github for help with creating the map
* and credits to bl.ocks.org for helping with the barchart
*/

window.onload = function() {
};

queue()
	.defer(d3.json, "labourForce.json")
	.defer(d3.json, "details.json")
	.awaitAll(load);

// loading data
function load(error, data) {
	if (error) throw error;

	var labourforce = data[0];
	var details = data[1];
	
	// min and max values labourforce
	var minValue = 186750;
	var maxValue = 41961250;

	// create color palette
	var paletteScale = d3.scale.linear()
		.domain([minValue, maxValue])
		.range(["#EFEFFF", "#02386F"]);

	// rewrite dataset so it is usable for map
	var labour = {};
	labourforce.forEach(function(item){
		var iso = item["iso"];
		var value = item["labourforce"];
		labour[iso] = {value: value, fillColor: paletteScale(value)};
	});

	var infoCountry = [];
	var begin = 1

	// data arrays for each country for barchart
	for (var i = 0; i < 25; i++) {
		var country = [];
		for (var j = begin; j < (begin + 10); j++) {
			country.push(details[j])
		}
		begin += 10
		infoCountry.push(country);
	}

	map(labour, infoCountry);
	
	// default barchart Germany
	barchart(infoCountry[4][0]["iso"], infoCountry);
	console.log(infoCountry);
};

// creating the map
function map(labour, infoCountry) {
	var map = new Datamap ({
		element: document.getElementById("container"),
		scope: "world",
		projection: "mercator",
		setProjection: function(element) {
			var projection = d3.geo.equirectangular()
				.center([15, 50])
				.rotate([4.4, 0])
				.scale(810)
				.translate([element.offsetWidth / 2, element.offsetHeight / 2]);
			var path = d3.geo.path()
				.projection(projection);
			return {path: path, projection: projection};
		},

		geographyConfig: {
			borderWidth: 1.3,
			borderOpacity: 1,
			borderColor: "white",
			popupTemplate: function(geo, data) {
				// don't show tooltip if there is no data for that country
				if (!data) { return ; }
				return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Labourforce: <strong>', data.value, '</strong>',
                    '</div>'].join('');},
			popOnHover: true,
			highlightOnHover: true,
			highlightFillColor: function(geo) {return geo["fillColor"] || "lightgrey"; },
			highlightBorderColor: "white",
			highlightBorderWidth: 5,
			highlightBorderOpacity: 1
		},

		fills: { defaultFill: "lightgrey" },
		data: labour,

		done: function(datamap) {
			datamap.svg.selectAll(".datamaps-subunit").on("click", function(geo) {
				var place = geo.id;
				for (var i = 0; i < 25; i++) {
					if (place == infoCountry[i][0]["iso"]) {
						remove();
						barchart(place, infoCountry);
					};
				};
			});
		}
	});
};

// creating barchart
function barchart(place, infoCountry) {
	// setting the size of the canvas
	var margin = {top: 20, right: 20, bottom: 40, left: 200};
	var totalWidth = 600;
	var totalHeight = 400;
	var width = totalWidth - margin.left - margin.right;
	var height = totalHeight - margin.top - margin.bottom;
	var barPadding = 2

	var categories= ['Unemployed', 'Self employed', 'Labourforce male', 'Labourforce female', 'Employed in Services','Employed male','Employed in Industries','Employed female','Employed in Agriculture','Employed'];

	var tooltip = d3.select("body").append("div").attr("class", "toolTip");
	var body = d3.select("body");

	// creating svg
	var svg = body.append("svg")
		.attr("id", "chart")
	    .attr("height", totalHeight)
	    .attr("width", totalWidth);

	var g = svg.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// data for country
	for (var i = 0; i < 25; i++) {
		if (place == infoCountry[i][0]["iso"]) {
			var data = infoCountry[i];
		}
	};

	// scaling the x-axis
	var xScale = d3.scale.linear()
		.domain([0, 40000000])
	    .range([0, width]);

	// scaling the y-axis
	var yScale = d3.scale.ordinal()
        .domain(d3.range(data.length))
        .rangeRoundBands([height, margin.top]);

	// creating the y-axis
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left")
		.tickFormat(function(d, i) { return categories[9 - i];});

	g.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + (-margin.right) + (-margin.right) + ")")
	    .call(yAxis);

	// creating the x-axis
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickFormat(function(d) { return d / 1000000;});
		
	g.append("g")
	    .attr("class", "axis")
	    .attr("transform", "translate(" + (-margin.right) + "," + (height - margin.right) + ")") 
	    .call(xAxis);

	// x-axis label
	g.append("text")
	    	.attr("class", "text")
	    	.attr("x", margin.left + 40)
	    	.attr("y", height + margin.top)
	    	.style("text-anchor", "end")
	    	.text("Amount in Millions");

	// creating hover tooltip
	var hover = d3.tip()
	.attr("class", "d3-tip")
	.offset([20, 250])
	.html(function(d) { return "<span style='color:black'>" + (d.value) + "</span>";});

	svg.call(hover);
	
	// creating bars
	svg.selectAll("rect")
	    .data(data)
	    .enter()
	    .append("rect")
	    	.attr("transform", "translate(" + (height - margin.left + 40) + ")")
	        .attr("class", "bar")
	        .attr("height", yScale.rangeBand() - barPadding)
	        .attr("width", function(d) { return xScale(d.value);})
	        .attr("x", function(d, i) { return xScale(i);})
	        .attr("y", function(d, i) { return yScale(i);})
	        .style("fill", "steelblue")
	        .on("mouseover", hover.show)
			.on("mouseout", hover.hide);

	// // title barchart
	g.append("text")
		.attr("class", "text")
    	.attr("x", 300)
    	.attr("y", 20)
		.style("text-anchor", "end")
    	.text("Details about the labourforce in " + place)
};	        

// remove barchart
function remove(){
	d3.select("#chart").remove()
};
