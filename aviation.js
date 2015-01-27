//Width and height
var w = 700;
var h = 150;
var padding = 30;


var dataset = [
    {
        "PredHgt": [[1422230400, 80.00], [1422234000, 70.00], [1422237600, 50.00], [1422241200, 40.00], [1422244800, 35.00], [1422248400, 21.00], [1422252000, 39.00], [1422255600, 33.00], [1422259200, 29.00], [1422262800, 25.00], [1422266400, 24.00], [1422270000, 21.00], [1422273600, 19.00], [1422277200, 17.00], [1422280800, 13.00], [1422284400, 10.00], [1422288000, 10.00], [1422291600, 9.00], [1422295200, 8.00], [1422298800, 9.00], [1422302400, 9.00], [1422306000, 10.00], [1422309600, 12.00], [1422313200, 15.00], [1422316800, 16.00], [1422320400, 16.00], [1422324000, 16.00], [1422327600, 16.00], [1422331200, 16.00], [1422334800, 16.00], [1422338400, 16.00], [1422342000, 16.00], [1422345600, 16.00], [1422349200, 16.00], [1422352800, 16.00], [1422356400, 16.00], [1422360000, 16.00]],

        "Vsby": [[1422230400, 9.00], [1422234000, 7.00], [1422237600, 5.00], [1422241200, 3.00], [1422244800, 2.50], [1422248400, 2.00], [1422252000, 4.01], [1422255600, 4.50], [1422259200, 6.99], [1422262800, 7.00], [1422266400, 7.04], [1422270000, 7.08], [1422273600, 7.05], [1422277200, 7.03], [1422280800, 5.57], [1422284400, 3.43], [1422288000, 3.43], [1422291600, 2.71], [1422295200, 2.00], [1422298800, 1.00], [1422302400, 1.00], [1422306000, 2.04], [1422309600, 2.29], [1422313200, 2.80], [1422316800, 3.05], [1422320400, 3.14], [1422324000, 3.32], [1422327600, 3.50], [1422331200, 3.68], [1422334800, 3.86], [1422338400, 3.95], [1422342000, 4.07], [1422345600, 4.32], [1422349200, 4.57], [1422352800, 4.82], [1422356400, 5.07], [1422360000, 5.20]],

        "CigHgt": [[1422230400, 8000.00], [1422234000, 7000.00], [1422237600, 5000.00], [1422241200, 4000.00], [1422244800, 3500.00], [1422248400, 2100.00], [1422252000, 3900.00], [1422255600, 3300.00], [1422259200, 2900.00], [1422262800, 2500.00], [1422266400, 2400.00], [1422270000, 2100.00], [1422273600, 1900.00], [1422277200, 1700.00], [1422280800, 1300.00], [1422284400, 1000.00], [1422288000, 1000.00], [1422291600, 900.00], [1422295200, 800.00], [1422298800, 900.00], [1422302400, 900.00], [1422306000, 1000.00], [1422309600, 1200.00], [1422313200, 1500.00], [1422316800, 1600.00], [1422320400, 1600.00], [1422324000, 1600.00], [1422327600, 1600.00], [1422331200, 1600.00], [1422334800, 1600.00], [1422338400, 1600.00], [1422342000, 1600.00], [1422345600, 1600.00], [1422349200, 1600.00], [1422352800, 1600.00], [1422356400, 1600.00], [1422360000, 1600.00]]
}];

var data = d3.nest()
    .key(function(d) {
        console.log(d);
    })
    .sortKeys(d3.ascending)
    .entries(dataset);

//Create scale functions
var xScale = d3.time.scale()
    .domain([
     d3.min(dataset[0].Vsby, function(d) {
            return new Date(d[0] * 1000);
        }),
     d3.max(dataset[0].Vsby, function(d) {
            return new Date(d[0] * 1000);
        })])
    .range([padding, w - padding * 2]);


var yScale = d3.scale.linear()
    .domain([0, d3.max(dataset[0].Vsby, function(d) {
        return d[1];
    })])
    .range([h - padding, padding]);

var rScale = d3.scale.linear()
    .domain([d3.max(dataset[0].Vsby, function(d) {
        return d[1];
    }), 0])
    .range([3, 8]);

//Define X axis
var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5);

//Define Y axis
var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(11);

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);



// Draw LIFR Rectangle
var categories = [10, 5, 3, 1, 0];
var colors = ['#a1ffa4', 'rgb(255,255,179)', '#ffb175', 'rgb(251,128,114)'];

categories.forEach(function(e, index) {
    var rectangle = svg.append('rect')
        .attr("x", padding)
        .attr("y", yScale(categories[index]))
        .attr("width", w - 2 * padding)
        .attr("height", yScale(categories[index + 1]) - yScale(categories[index]))
        .attr("fill", colors[index])
        .attr("stroke", "#8a8a8a")
});

// Grid lines

svg.selectAll("line.horizontalGrid")
    .data(yScale.ticks(4))
    .enter()
    .append("line")
    .attr({
        "class": "horizontalGrid",
        "x1": padding,
        "x2": w - padding,
        "y1": function(d) {
            return yScale(d);
        },
        "y2": function(d) {
            return yScale(d);
        },
        "fill": "none",
        "shape-rendering": "crispEdges",
        "stroke": "rgba(0,0,0,0.2)",

        "stroke-width": "1px"
    });


//Create lines
var color = d3.scale.threshold()
    .domain([0, 3, 5, 10])
    .range(colors.reverse());

var lineFunction = d3.svg.line()
    .x(function(d) {
        return xScale(d[0] * 1000);
    })
    .y(function(d) {
        return yScale(d[1]);
    })
    .interpolate("linear");
svg.selectAll('.path')
    .data(data)
    .enter().append('path')
    .attr("d", function(d) {
        return lineFunction(dataset[0].Vsby);
    })
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");

//Create circles
svg.selectAll("circle")
    .data(dataset[0].Vsby)
    .enter()
    .append("circle")
    .attr("fill", function(d) {
        console.log(d[1], color(d[1]))
        return color(d[1]);
    })
    .attr("stroke", "black")
    .attr("cx", function(d) {
        return xScale(d[0] * 1000);
    })
    .attr("cy", function(d) {
        return yScale(d[1]);
    })
    .attr("r", function(d) {
        return rScale(d[1]);
    });

//
//// Text Shadow
//svg.selectAll("text")
//	   .data(dataset[0].Vsby)
//	   .enter()
//	   .append("text")
//	   .text(function(d) {
//			return  parseInt(d[1]);
//	   })
//	   .attr("x", function(d) {
//			return xScale(new Date(d[0] * 1000));
//	   })
//	   .attr("y", function(d) {
//			return yScale(d[1]);
//	   })
//	   .attr("font-family", "sans-serif")
//		.attr("class", "shadow")
//		.attr("text-anchor", "middle")
//	   .attr("font-size", "11px")
//	   .attr("fill", "white");
//
//	//Create labels
//	svg.selectAll(".text")
//	   .data(dataset[0].Vsby)
//	   .enter()
//	   .append("text")
//	   .text(function(d) {
//	   console.log(d);
//			return  parseInt(d[1]);
//	   })
//	   .attr("x", function(d) {
//			return xScale(new Date(d[0] * 1000));
//	   })
//	   .attr("y", function(d) {
//			return yScale(d[1]);
//	   })
//	   .attr("font-family", "sans-serif")
//	   .attr("font-size", "11px")
//	   .attr("text-anchor", "middle")
//	   .attr("fill", "black");


//Create X axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis);

//Create Y axis
svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + padding + ",0)")
    .call(yAxis);