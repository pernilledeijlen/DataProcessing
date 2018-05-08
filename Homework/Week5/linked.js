/*
* Pernille Deijlen
* 10747354
* Linked Views with Javascript using d3 version 4
* credits to the blog from Robert Jesionek for helping with creating the map
* ....
*/

// loading datasets
queue()
	.defer(d3.json, "labourForce.json")
	// .defer(d3.json, more info on labour , json")
	.await(makeVisualisation);

function makeVisualisation(error, labourForce)
{
	if (error) throw error;

	console.log(labourForce);
	
	var labour = []
	var countries = []
	for (i = 0; i < 25; i++)
	{
		countries.push(labourForce[i].country)
		labour.push(labourForce[i].labourforce)
	}
	console.log(countries)
	console.log(labour)

	// make a map of europe with data from labourForce.json = data1
	// setting width and height
	var width = 800
	var height = 800

	var projection = d3.geo.mercator()
	    .center([4, 68.6])
	    .scale(700)
	    .translate([width / 2, 0])

	// creating svg
	var svg = d3.select("body").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	var path = d3.geo.path().projection(projection);
	var g = svg.append("g");

	// getting countries from topojson file
	d3.json("Europe.topojson", function(europe) {
		g.selectAll("path")
		.data(topojson.feature(europe, europe.objects.collection).features)
		.enter()
		.append("path")
		.attr("d", path)
		.on("mouseover", showInfo)
		// .on("click", barChart)
	});

	svg.append("rect")
		.attr("class", "infobox")
		.attr("width", 150)
		.attr("height", 100)
		.attr("x", 0)
		.attr("y", 350)

	svg.append("text")
		    .attr("class", "text")
	    	.attr("x", 5)
	    	.attr("y", 370)
	    	.style("text-anchor", "begin")
	    	.text("country:");

	svg.append("text")
		    .attr("class", "text")
	    	.attr("x", 5)
	    	.attr("y", 410)
	    	.style("text-anchor", "begin")
	    	.text("labour force:");    	


	function showInfo(d) {
		for (i = 0; i < 25; i++)
		{
			svg.append("text")
			    .attr("class", "text")
		    	.attr("x", 5)
		    	.attr("y", 390)
		    	.style("text-anchor", "begin")
		    	.text("countries[i]");

		    svg.append("text")
			    .attr("class", "text")
		    	.attr("x", 5)
		    	.attr("y", 430)
		    	.style("text-anchor", "begin")
		    	.text("labour[i]");
	    }    	
	}

	// country clicked
	// go to barchart





}
















// 2014 EU
// een map met landen europa en data over labour force: all members of a country who are able to work(16-65?)
// wanneer je over hovert iets met de kleur, show country name and datavalue
// hoe groter de labour force hoe donkerder de kleur op map oid

// stap 2:
// dan wanneer je klikt een bar chart met details over bovenstaande data
// dus dan details over de labour force, man/vrouw/industrie/leeftijd
// better life index, labour force statistics, annual labour force, ALFS summary
