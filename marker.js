
var data = [],
  timestamp = new Date();
timestamp.setMinutes(0);
for (var i = 0; i < 24; i++) {
  var hours = timestamp.getHours() + 1;
  timestamp.setHours(hours);
  data.push({
    timestamp: new Date(timestamp),
    value: Math.random()
  });
}

console.log(data);

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
var domainX = d3.extent(data, function(datum) {
  return datum.timestamp;
});
var domainY = d3.extent(data, function(datum) {
  return datum.value;
});

// Ranges
var rangeX = [0, width],
  rangeY = [height, 0];

// Scales
var scaleX = d3.time.scale()
  .domain(domainX)
  .range(rangeX);
var scaleY = d3.scale.linear()
  .domain(domainY)
  .range(rangeY);

// Shape generators
var line = d3.svg.line()
  .x(function(datum) {
    return scaleX(datum.timestamp);
  })
  .y(function(datum) {
    return scaleY(datum.value);
  });

// Append an SVG element
var svg = d3.select('body')
  .append('svg')
  .attr('width', width)
  .attr('height', height);

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

svg.on("click", function() {
  if (d3.event.defaultPrevented) return; // click suppressed
  console.log("clicked!");
});
