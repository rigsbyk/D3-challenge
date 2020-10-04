// @TODO: YOUR CODE HERE!

// Step 1: Set up our chart
var svgWidth = 960;
var svgHeight = 630;

var margin = {
    top:20,
    right:40,
    bottom:80,
    left:100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height",svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3:
// Import data from the donuts.csv file
 d3.csv("assets/data/data.csv").then(function(stateData) {

    stateData.forEach(function(data) {
        
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
        
        //console.log(stateData)

    });

  // Function for x and y scale axis dimension
var xLinearScale = d3.scaleLinear()
    .domain([8.5, d3.max(stateData, d => d.poverty)])
    .range([0,width]);

var yLinearScale = d3.scaleLinear()
    .domain([4.5, d3.max(stateData, d => d.healthcare)]) 
    .range([height,0]);

    // we neeed to pass the scale arguments to a variable

var bottomAxis = d3.axisBottom(xLinearScale).ticks(8);
var leftAxis = d3.axisLeft(yLinearScale);

// Append the svg to the chart group so it creates the line in the axis

chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

chartGroup.append("g")
    .call(leftAxis);

   // Create one SVG per piece of stateData

   var circleGroup = chartGroup.selectAll("circle")
   .data(stateData)
   .enter()
   .append("circle")
   .attr("cx", d => xLinearScale(d.poverty))
   .attr("cy", d => yLinearScale(d.healthcare))
   .attr("r", "12")
   .classed("stateCircle", true)

 // Append the text 
chartGroup.selectAll()
   .data(stateData)
   .enter()
   .append("text")
   .attr("x", d => xLinearScale(d.poverty))
   .attr("y", d => yLinearScale(d.healthcare))
   .text(n => n.abbr)
   .classed("stateText", true)
   .attr("font-size", "8px")

   var toolTip = d3.tip()
   .attr("class","tooltip d3-tip")
   .offset([80, -60])
   .html(function(d) {
       return(`${d.state}<br>Poverty: ${d.poverty} % <br>Healthcare: ${d.healthcare}`);
   });

circleGroup.call(toolTip);

circleGroup.on("mouseover", function(d){
   toolTip.show(d, this);
   })

   .on("mouseout", function(d){
       toolTip.hide(d);
       });

       // create the labels 

chartGroup.append("text")
   .attr("transform", "rotate(-90)")
   .attr("y", 0 - margin.left)
   .attr("x", 0 - (height/2))
   .attr("dy", "1em")
   .attr("class", "axisText")
   .text("Lacks Healthcare(%)")
   .attr("font-weight", "bold");


chartGroup.append("text")
   .attr("transform", `translate(${width/2}, ${height+40})`)
   .attr("class","axisText")
   .text("In Poverty(%)")
   .attr("font-weight", "bold");

}).catch(function(error){
   console.log(error);
   }); 


