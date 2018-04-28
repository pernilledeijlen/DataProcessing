/*
* Pernille Deijlen
* 10747354
* Bar graph with Javascript using d3 version 4
*/  


var body = d3.select("body");

// adding text to page
d3.select("head").append("title").text("Barchart");
body.append("p").text("Pernille Deijlen");
body.append("p").text("10747354");
body.append("h1").text("Balance of Payments");
body.append("p").text("This dataset contains data from the World Bank on the Balance of Payments (BoP) of the Netherlands from 2000 until 2016.\
  The BoP of a country is the record of all economic transactions between the country itself and the rest of the world.\
  The barchart below shows the BoP (measured in US dollars) for the mentioned years.");

// setting the size of the canvas
var margin = {top: 20, right: 20, bottom: 40, left: 70}
var totalWidth = 600
var totalHeight = 400
var width = totalWidth - margin.left - margin.right
var height = totalHeight - margin.top - margin.bottom
var barPadding = 1

var svg = body.append("svg")
    .attr("height", totalHeight)
    .attr("width", totalWidth);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// loading the data
d3.json("dutchBoP.json", function(error, data)
{
    if (error)
    {
      return console.warn(error);
    }

    // creating bars
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
            .attr("class", "bar")
            .attr("height", function(d) {return (d.BoP / 300000000)})
            .attr("width", width / data.length - barPadding)
            .attr("x", function(d, i) {return i * (width / data.length)})
            .attr("y", function(d) {return height - (d.BoP / 300000000)});

    // show information when hovering over bar
    var myTool = body.append("div")
        .attr("class", "mytooltip")
        .style("opacity", "0")
        .style("display", "none");

    body.selectAll("div")
        .data(data)
        .enter()
        .append("div")
        .on("mouseover", function(d) {
            d3.select(this)
                .enter()
                .append("text")
                .text(function(d) {return d.BoP})
                .attr("class", "text")
                .attr("x", function(d, i) {return i * (width / data.length)})
                .attr("y", function(d, i) {return height - (d.BoP / 300000000)});
        })
    
    // svg.selectAll("text")
    //     .data(data)
    //     .enter()
    //     .append("text")
    //     .text(function(d) {return d.BoP})
    //         .attr("class", "text")
    //         .attr("x", function(d, i) {return i * (width / data.length)})
    //         .attr("y", function(d, i) {return height - (d.BoP / 300000000)});

    // scaling the y and x axis
    var y = d3.scaleLinear()
        .domain([0, d3.max(data, function(d) {return d.BoP; })])
        .range([height, 10])
        .nice();

    var x = d3.scaleBand()
        .domain(data.map(function(d) {return d.year}))
        .range([0, width]);

    var yAxis = d3.axisRight().scale(y);
    var xAxis = d3.axisBottom().scale(x);
    
    // creating the y and x axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (width - margin.left) + (-margin.right) + ")")
        .call(yAxis);
        
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (-margin.left) + "," + (height - margin.right) + ")") 
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-50)")
        .attr('dx', '-.9em')
        .attr('dy', '.4em');

});