/*
* Pernille Deijlen
* 10747354
* Linked Views with Javascript using d3 version 3
* credits to datamaps on github for creating the map
* ....
*/

window.onload = function() {};

queue()
	.defer(d3.json, "labourForce.json")
	// .defer(d3.json, file)
	.awaitAll(load);

// loading data and make map
function load(error, data) {
	if (error) throw error;

	// min and max values
	var minValue = 186750
	var maxValue = 41961250

	// create color palette
	var paletteScale = d3.scale.linear()
		.domain([minValue, maxValue])
		.range(["#EFEFFF", "#02386F"]);

	// rewrite dataset so it is usable for map
	var labour = {};
	data[0].forEach(function(item){
		var iso = item["iso"]
		var value = item["labourforce"]
		labour[iso] = {value: value, fillColor: paletteScale(value)}
	})

	map(labour);
	// barchart(info);
}

function map(labour) {
	// creating the map (change scale voor uit en inzoomen)
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
		data: labour
	});
}


// function barchart(info)
// creating barchart, maak een funcit
// setting the size of the canvas
var margin = {top: 20, right: 20, bottom: 40, left: 200}
var totalWidth = 600
var totalHeight = 400
var width = totalWidth - margin.left - margin.right
var height = totalHeight - margin.top - margin.bottom

var body = d3.select("body");

// creating svg
var svg = body.append("svg")
    .attr("height", totalHeight)
    .attr("width", totalWidth);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// // select data for country
// for (var i = 0; i < XXX; i++) {

// }


// // scaling the x-axis
// var xScale = d3.scaleLinear()
// 	.domain([0, d3.max(dataset[0], function(d) {return d[0];})])
// 	.range([margin.right, width - margin.left]);

// // scaling the y-axis
// var yScale = d3.scaleLinear()
//     .domain([0, d3.max(dataset[0], function(d) {return d[1];})])
//     .range([height, 0]);

// // creating bars
// svg.selectAll("rect")
//     .data(data)
//     .enter()
//     .append("rect")
//         .attr("class", "bar")
//         .attr("height", function(d) {return (d.BoP / 300000000)})
//         .attr("width", width / data.length - barPadding)
//         .attr("x", function(d, i) {return i * (width / data.length)})
//         .attr("y", function(d) {return height - (d.BoP / 300000000)});

// // creating the x axis
// g.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(" + (-margin.left) + "," + (height - margin.right) + ")") 
//     .call(d3.axisBottom(xScale));

// g.append("text")
// 	.attr("class", "text")
// 	.attr("x", margin.left)
// 	.attr("y", height + margin.top)
// 	.style("text-anchor", "end")
// 	.text("share of employed who are female employers");

// // creating the y axis
// g.append("g")
//     .attr("class", "axis")
//     .attr("transform", "translate(" + (width - margin.left - margin.left) + (-margin.right) + ")")
//     .call(d3.axisRight(yScale));

// 	g.append("text")
// 		.attr("class", "text")
// 		.attr("transform", "rotate(-90)")
// 	.attr("x", margin.top)
// 	.attr("y", width - margin.left - 160)
// 	.style("text-anchor", "end")
// 	.text("difference between male and female average income");

// function update(data) {

// }
	


// stap 2:
// dan wanneer je klikt een bar chart met details over bovenstaande data
// dus dan details over de labour force, man/vrouw/industrie/leeftijd
// better life index, labour force statistics, annual labour force, ALFS summary
