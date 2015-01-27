d3.json("data/KCRW.json", function(error, json) {
    if (error) return console.warn(error);

    visualizeIt(json, "PredHgt", "Ceiling (ft x 100)");
    //    visualizeIt(json, "CigHgt");
    visualizeIt(json, "Vsby", "Visibility (nmi.)");
});



function visualizeIt(dataset, field, yAxisLabel) {
    //Width and height
    var width = 700;
    var height = 150;

    var margin = {
        top: 40,
        right: 10,
        bottom: 0,
        left: 50
    };




    //Create scale functions
    var xScale = d3.time.scale()
        .domain([
     d3.min(dataset[field], function(d) {
                return new Date(d[0] * 1000);
            }),
     d3.max(dataset[field], function(d) {
                return new Date(d[0] * 1000);
            })])
        .range([margin.left, width + margin.left]);

    if (field == "Vsby") {
        var yScale = d3.scale.linear()
            .domain([0, d3.max(dataset[field], function(d) {
                return d[1];
            })])
            .range([height + margin.bottom, margin.top]);
    } else {
        var yScale = d3.scale.log()
            .domain([1, d3.max(dataset[field], function(d) {
                return d[1];
            })])
            .nice()
            .range([height + margin.bottom, margin.top]);
    }

    var rScale = d3.scale.linear()
        .domain([d3.max(dataset[field], function(d) {
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
        .ticks(11)
        .tickFormat(function(d) {
            return yScale.tickFormat(4, d3.format(",d"))(d)
        });



    //Create SVG element
    var svg = d3.select("body")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);




    // Draw Flight Cat Rectangles
    if (field == "Vsby") {
        var categories = [10, 5, 3, 1, 0];
        //var colorCategories = categories.reverse();
    } else {
        var categories = [250, 30, 10, 5, 1];
        //var colorCategories = categories.reverse();
    }


    var colors = ['#a1ffa4', 'rgb(255,255,179)', '#ffb175', '#c59dd8'];

    categories.forEach(function(e, index) {
        if (index + 1 < categories.length) {
            var rectangle = svg.append('rect')
                .attr("x", margin.left)
                .attr("y", yScale(categories[index]))
                .attr("width", width)
                .attr("height", yScale(categories[index + 1]) - yScale(categories[index]))
                .attr("fill", colors[index])
                .attr("stroke", "#8a8a8a")
        }
    });

    // Grid lines

    svg.selectAll("line.horizontalGrid")
        .data(yScale.ticks(4))
        .enter()
        .append("line")
        .attr({
            "class": "horizontalGrid",
            "x1": margin.left,
            "x2": margin.left + width,
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


    //Create X axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis);

    //Create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x", 0 - ((margin.top + height) / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(yAxisLabel);


    //Create lines

    // Color categories have to be sorted ascending
    var colorCategories = categories.reverse();
    // Knock off the first value since that's the way the colors get properly mapped
    colorCategories.shift();
    var color = d3.scale.threshold()
        .domain(colorCategories)
        .range(colors.reverse());

    // Tooltip
    // tooltip
    var tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong>Value:</strong> <span style='color:white'>" + d[1] + "</span>";
        })

    var lineFunction = d3.svg.line()
        // Get rid of nulls
        .defined(function(d) {
            return d[1] != null;
        })
        .x(function(d) {
            return xScale(d[0] * 1000);
        })
        .y(function(d) {
            return yScale(d[1]);
        })
        .interpolate("linear")

    svg.selectAll('.path')
        .data(dataset[field])
        .enter().append('path')
        .attr("d", function(d) {
            return lineFunction(dataset[field]);
        })
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", "none");


    svg.call(tip);




    //Create circles
    svg.selectAll("circle")
        .data(dataset[field])
        .enter()
        .append("circle")
        .attr("fill", function(d) {

            return color(d[1]);
        })
        .attr("stroke", "black")
        .attr("cx", function(d) {
            return xScale(d[0] * 1000);
        })
        .attr("cy", function(d) {
            return d[1] == null ? 100 : yScale(d[1]);
        })
        .attr("r", function(d) {
            return d[1] == null ? 0 : 4; //rScale(d[1]);
        })
        .on('mouseover', function(e) {
            tip.show(e);
            var circle = d3.select(this);
            circle.transition().duration(500)
                .attr("r", circle.attr("r") * 1 + 10);
        })
        .on('mouseout', function(e) {
            tip.hide(e);
            var circle = d3.select(this);
            circle.transition().duration(500)
                .attr("r", 4);

        })


    // Text Shadow
    var offset = 10;

    svg.selectAll(".text")
        .data(dataset[field])
        .enter()
        .append("text")
        .text(function(d) {
            return parseInt(d[1]);
        })
        .attr("x", function(d) {
            return xScale(new Date(d[0] * 1000));
        })
        .attr("y", function(d) {
            return yScale(d[1]) - offset;
        })
        .attr("font-family", "sans-serif")
        .attr("class", "shadow")
        .attr("text-anchor", "middle")
        .attr("font-size", "11px")
        .attr("fill", "white");

    //Create labels
    svg.selectAll(".text")
        .data(dataset[field])
        .enter()
        .append("text")
        .text(function(d) {
            return parseInt(d[1]);
        })
        .attr("x", function(d) {
            return xScale(new Date(d[0] * 1000));
        })
        .attr("y", function(d) {
            return yScale(d[1]) - offset;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    // Title
    svg.append("text")
        .attr("x", ((margin.left + width) / 2))
        .attr("y", margin.top / 2 - 4)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        //.style("text-decoration", "underline")
        .text(field);

}