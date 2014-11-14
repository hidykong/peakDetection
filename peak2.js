
var x = d3.time.scale()
    .range([0, width]);

 var y = d3.scale.linear()
    .range([height, 0]);

 var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.time); })
    .y(function(d) { return y(d.value); });

// var data = [],
//   timestamp = new Date();
// timestamp.setMinutes(0);
// for (var i = 0; i < 24; i++) {
//   var hours = timestamp.getHours() + 1;
//   timestamp.setHours(hours);
//   data.push({
//     timestamp: new Date(timestamp),
//     value: Math.random()
//   });
// }


// Dimensions
var margin = {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  width = 960,
  height = 500;

// Domains
// var domainX = d3.extent(data, function(datum) {
//   return datum.timestamp;
// });
// var domainY = d3.extent(data, function(datum) {
//   return datum.value;
// });

// // Ranges
// var rangeX = [0, width],
//   rangeY = [height, 0];

// Scales
// var scaleX = d3.time.scale()
//   .domain(domainX)
//   .range(rangeX);
// var scaleY = d3.scale.linear()
//   .domain(domainY)
//   .range(rangeY);


// // Shape generators
// var line = d3.svg.line()
//   .x(function(datum) {
//     return scaleX(datum.timestamp);
//   })
//   .y(function(datum) {
//     return scaleY(datum.value);
//   });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv("csvlist.csv", type, function(error, data) {
  x.domain(d3.extent(data, function(d) { return d.time; }));
  y.domain(d3.extent(data, function(d) { return d.value; }));

// Append an SVG element



  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .text("Value");


// Append path
var path = svg.append('path')
  .datum(data)
  .attr('class', 'line')
  .attr('d', line)
  .style('fill', 'none')
  .style('pointer-events', 'none')
  .style('stroke', '#FB5050')
  .style('stroke-width', '3px');

// Append marker
var marker = svg.append('circle')
  .attr('r', 7)
  .style('display', 'none')
  .style('fill', '#FFFFFF')
  .style('pointer-events', 'none')
  .style('stroke', '#FB5050')
  .style('stroke-width', '3px');

// Create custom bisector
var bisect = d3.bisector(function(datum) {
  return datum.timestamp;
}).right;

// Add event listeners/handlers
svg.on('mouseover', function() {
  marker.style('display', 'inherit');
}).on('mouseout', function() {
  marker.style('display', 'none');
}).on('mousemove', function() {
  var mouse = d3.mouse(this);
  marker.attr('cx', mouse[0]);
  var timestamp = scaleX.invert(mouse[0]),
    index = bisect(data, timestamp),
    startDatum = data[index - 1],
    endDatum = data[index],
    interpolate = d3.interpolateNumber(startDatum.value, endDatum.value),
    range = endDatum.timestamp - startDatum.timestamp,
    valueY = interpolate((timestamp % range) / range);
  marker.attr('cy', scaleY(valueY));
});



});



var parseDate = d3.time.format("%H:%M:%S.%L").parse;

function type(d) {
  d.time = new Date(+parseDate(d.time)); //create a date in milliseconds
  d.value = +d.value; 
  return d;
}
