// eventueel src=dan de filenaam voor externe javascript file
			
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
	//dates[i] = new Date(YYYY + "-" + MM + "-" + DD);
}

// printing the arrays
console.log(dates)
console.log(temps)

var canvas = document.getElementById("graph");
var ctx = canvas.getContext("2d");
//ctx.fillStyle = "pink";
//ctx.fillRect(0,0,300,300);

// the vertical axes (temperatures range from -38 to 236, total: 274, transform x 1.5, range 411, neg: -57, pos: 354)
ctx.beginPath();
ctx.moveTo(50, 146);
ctx.lineTo(50, 557);
ctx.stroke();

// horizontal axes (dates range from 0 to 364, total: 365, transform x 1.5, range 547.5)
ctx.beginPath();
ctx.moveTo(50, 500);
ctx.lineTo(597.5, 500);
ctx.stroke();

// horizontal lines to make it pretty (for 5 degrees celsius, ff kijken of het blurry kan of de echte graph dikker of een kleur)
for (let i = 1; i < 5; i++)
{
	ctx.beginPath();
	ctx.moveTo(50, 500 - i * 50 * 1.5);
	ctx.lineTo(597.5, 500 - i * 50 * 1.5);
	ctx.stroke();
	ctx.fillText(eval("i * 5"), 30, 500 - i * 50 * 1.5);
}

for (let i = 1; i < 8; i ++)
{
	ctx.fillText(eval("i * 50"), 50 + i * 50 * 1.5, 520);
}

// making graph with temperatures and dates (0 to 364)
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

// info
ctx.font = "14px Times New Roman"
ctx.fillText("Name:", 550, 20);
ctx.fillText("Pernille Deijlen", 640, 20);
ctx.fillText("Assignment:", 550, 35);
ctx.fillText("Line graph with Javascript", 640, 35);
ctx.fillText("Data source:", 550, 50);
ctx.fillText("projects.knmi.nl", 640, 50);

// graph and axes titles
ctx.font = "20px Times New Roman";
ctx.fillText("Average temperature in the Bilt 2017", 180, 50);
ctx.fillText("Time (in days)", 250, 550);
ctx.rotate(-90*Math.PI/180);
ctx.fillText("Temperature (in degrees Celsius)", -460, 20);

// function createTransform(domain, range)
// {
// 	// domain is a two-element array of the data bounds [domain_min, domain_max]
// 	// range is a two-element array of the screen bounds [range_min, range_max]
// 	// this gives you two equations to solve:
// 	// range_min = alpha * domain_min + beta
// 	// range_max = alpha * domain_max + beta
//  		// a solution would be:

//     var domain_min = domain[0]
//     var domain_max = domain[1]
//     var range_min = range[0]
//     var range_max = range[1]

//     // formulas to calculate the alpha and the beta
//    	var alpha = (range_max - range_min) / (domain_max - domain_min)
//     var beta = range_max - alpha * domain_max

//     // returns the function for the linear transformation (y= a * x + b)
//     return function(x)
//     {
//       return alpha * x + beta;
//     }
// }