/*
* Pernille Deijlen
* 10747354
* Scatter plot with Javascript using d3 version 4
* credits to blocks.org for helping with the code
*/  

// all code should be enclosed by functions
// to run all functions do:

window.onload = function()
{
  console.log('Hoi!')
};


// user should be able to switch between datasets, like years, countries oid.
// meerdere jaren meerdere landen, 1 jaar meerdere landen (optie is dan van jaar veranderen)
// share of employed who are employers (women) vs
// difference male and female av income, man - women / man * 100 DUS hoe meer vrouwen verdienen, hoe lager de uitkomst, wanneer man en vrouw evenveel verdienen is de uitkomst 0
// countries: austria, belgium, cheg, finland, france, greece, hungary, ireland, italy, lux, nederlands, norway, poland, portugal, slove?, spain, sweden, che? swiss, great britain
// years: 2004 tm 2014, countries: 14, years: 11

var femaleEmployers = "http://stats.oecd.org/SDMX-JSON/data/GENDER_ENT1/AUT+BEL+CZE+FIN+FRA+HUN+IRL+LUX+NLD+NOR+POL+SVN+SWE+GBR.ENT1.WOMEN.TOTAL/all?startTime=2004&endTime=2014&dimensionAtObservation=allDimensions"
var incomeGap = "http://stats.oecd.org/SDMX-JSON/data/GENDER_ENT1/AUT+BEL+CZE+FIN+FRA+HUN+IRL+LUX+NLD+NOR+POL+SVN+SWE+GBR.ENT7.ALL.TOTAL/all?startTime=2004&endTime=2014&dimensionAtObservation=allDimensions"

d3.queue()
  .defer(d3.request, femaleEmployers)
  .defer(d3.request, incomeGap)
  .awaitAll(scatter);


function scatter(error, response) {
 	if (error) throw error;

	console.log(response);

	// number of countries and years in dataset
	var numberCountries = 14
	var numberYears = 11

	// parsing to json
	var jsonFemale = JSON.parse(response[0].responseText) 
	var jsonIncome = JSON.parse(response[1].responseText)

	console.log(jsonFemale)
	console.log(jsonIncome)

	// store countries
	var countries = []

	// get countries
	for (country = 0; country < numberCountries; country++)
	{
		europe = jsonFemale["structure"]["dimensions"]["observation"]["0"]["values"][country]["name"]
		countries.push(europe)

	}

	console.log(countries)

	// store years
	var years = []

	// get years
	for (year = 0; year < numberYears; year++)
	{
		time = jsonFemale["structure"]["dimensions"]["observation"]["4"]["values"][year]["name"]
		years.push(time)
	}

	console.log(years)

	// store share of employed who are female employers
	var employers = []

	for (year = 0; year < numberYears; year++)
	{
		var employersFemale = []

		for (country = 0; country < numberCountries; country++)
		{
			employersFemale.push(jsonFemale["dataSets"]["0"]["observations"][country + ":0:0:0:" + year][0])
		}
		employers.push(employersFemale)
	}

	console.log(employers)

	// store difference in income between males and females
	var income = []

	for (year = 0; year < numberYears; year++)
	{
		var incomeCountry = []

		for (country = 0; country < numberCountries; country++)
		{
			incomeCountry.push(jsonIncome["dataSets"]["0"]["observations"][country + ":0:0:0:" + year][0]) 
		}
		income.push(incomeCountry)
	}

	console.log(income)

	// create x and y values for scatterplot
	var dataset = []
	for (year = 0; year < numberYears; year++)
	{
		var data = []	
		for (country = 0; country < numberCountries; country++)
		{
			data.push([employers[year][country], income[year][country]])
		}
		dataset.push(data)
	}
	console.log(dataset)

	// setting the size of the canvas
	var margin = {top: 20, right: 20, bottom: 40, left: 70}
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

	var color = d3.scaleOrdinal(d3.schemePastel1);

	// scaling the x-axis
	var xScale = d3.scaleLinear()
		.domain([0, d3.max(dataset[0], function(d) {return d[0];})])
		.range([0, width]);

	// scaling the y-axis
	var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset[0], function(d) {return d[1];})])
        .range([height, 0]);

	// creating dots
	svg.selectAll("dots")
        .data(dataset[0])
        .enter()
        .append("dots")
            .attr("cx", function(d) {return xScale(d[0]);})
            .attr("cy", function(d) {return yScale(d[1]);})
            .attr("r", 5)
        	.style("fill", function(d) {return color(d);});

    // creating the x axis
    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (-margin.left) + "," + (height - margin.right) + ")") 
        .call(d3.axisBottom(xScale))
    
    g.append("text")
    	.attr("class", "label")
    	.attr("x", width - margin.left)
    	.attr("y", height + margin.top)
    	.style("text-anchor", "end")
    	.text("share of employed who are female employers");

    // creating the y axis
	g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + (width - margin.left) + (-margin.right) + ")")
        .call(d3.axisRight(yScale));

   	g.append("text")
   		.attr("class", "label")
   		.attr("transform", "rotate(-90)")
        // .attr('dx', '-.9em')
        // .attr('dy', '.4em')
    	.attr("x", margin.top)
    	.attr("y", width - margin.right)
    	.style("text-anchor", "end")
    	.text("difference between male and female average income")

    // draw legend
    // var legend = svg.selectAll("legend")
    // 	.data(color.domain())
    // 	.enter()
    // 	.append("")


	








	

	
};