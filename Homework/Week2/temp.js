/*
* Pernille Deijlen
* 10747354
* Line graph with Javascript
*/	

// split into lines so you get back an array
let enter = "\n";
let data = document.getElementById("rawdata").outerHTML.split(enter);

let comma = ",";
let array = [];
for (let i = 1; i < 366; i++)
{
	// split into dates and temperatures and create array of data points
	array.push.apply(array, data[i].split(comma));
}

var temps = []
var dates = []
// array for dates
for (let i = 0; i < 729; i += 2)
{
	dates.push.apply(dates, array[i].split(comma));
}

// array for temperatures
for (let i = 1; i < 730; i += 2)
{
	temps.push.apply(temps, array[i].split(comma));
}

// making the dates dates and the temperatures numbers
for (let i = 0; i < 365; i++)
{
	temps[i] = parseInt(temps[i]);
	let YYYY = dates[i].slice(0, 4);
	let MM = dates[i].slice(4, 6);
	let DD = dates[i].slice(6);
	dates[i] = new Date(YYYY + "-" + MM + "-" + DD).toISOString().
	split('T')[0];
}

// printing the arrays
console.log(dates)
console.log(temps)

// create canvas for graph
var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");

// y axes, total range temperature 274, transform * 1.5 so a range of 411
ctx.beginPath();
ctx.moveTo(50, 146);
ctx.lineTo(50, 557);
ctx.stroke();

// x axes, totale range dates 365, transform * 1.5 so a range of 547.5
ctx.beginPath();
ctx.moveTo(50, 500);
ctx.lineTo(597.5, 500);
ctx.stroke();

// extra horizontal lines and text for the y axis
for (let i = 1; i < 5; i++)
{
	ctx.beginPath();
	ctx.moveTo(50, 500 - i * 50 * 1.5);
	ctx.lineTo(597.5, 500 - i * 50 * 1.5);
	ctx.stroke();
	ctx.fillText(eval("i * 5"), 30, 500 - i * 50 * 1.5);
}

// text for the x axis
for (let i = 1; i < 8; i ++)
{
	ctx.fillText(eval("i * 50"), 50 + i * 50 * 1.5, 520);
}

// making graph with temperatures and dates
ctx.beginPath();
// making first datapoint
let y = 0
let x = temps[0]
ctx.moveTo(50 + 1.5 * y, 500 - 1.5 * x);
ctx.fillText("0", 30, 500);

// making graph for all other datapoints
for (let i = 1; i < 365; i++)
{
	x = temps[i];
	y = i;
	ctx.lineWidth = 1.5;
	ctx.lineTo(50 + 1.5 * y, 500 - 1.5 * x);
}
ctx.strokeStyle = "purple";
ctx.stroke();

// graph info
ctx.font = "14px Times New Roman"
ctx.fillText("Name:", 550, 20);
ctx.fillText("Pernille Deijlen", 640, 20);
ctx.fillText("Assignment:", 550, 35);
ctx.fillText("Line graph with Javascript", 640, 35);
ctx.fillText("Data source:", 550, 50);
ctx.fillText("projects.knmi.nl", 640, 50);

// graph and axis titles
ctx.font = "20px Times New Roman";
ctx.fillText("Average temperature in the Bilt 2017", 180, 50);
ctx.fillText("Time (in days)", 250, 550);
ctx.rotate(-90*Math.PI/180);
ctx.fillText("Temperature (in degrees Celsius)", -460, 20);