
var margin = {top: 20.5, right: 30, bottom: 30, left: 40.5},
    width = 1200 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

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

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

var trans = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("csvlist.csv", type, function(error, data) {

  x.domain(d3.extent(data, function(d) { return d.time; }));
  y.domain(d3.extent(data, function(d) { return d.value; }));


  trans.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  trans.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "title")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .text("Value");

  var path = trans.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
    .style('fill', 'none')
    .style('pointer-events', 'none')
    .style('stroke', '#FB5050')
    .style('stroke-width', '3px');

  // Append marker
  var marker = trans.append('circle')
    .attr('r', 7)
    .style('display', 'none')
    .style('fill', '#FFFFFF')
    .style('pointer-events', 'none')
    .style('stroke', '#FB5050')
    .style('stroke-width', '3px');


  // Create custom bisector
  var bisect = d3.bisector(function(datum) {
    return datum.time;
  }).right;

  
// Add event listeners/handlers
  svg.on('mouseover', function() {
    marker.style('display', 'inherit');
  }).on('mouseout', function() {
    marker.style('display', 'none');
  }).on('mousemove', function() {
    var mouse = d3.mouse(this);
    marker.attr('cx', mouse[0] - margin.left);

    //var timestamp = x.invert(mouse[0]- margin.left +10),
    var timestamp = x.invert(mouse[0] - margin.left),
      index = bisect(data, timestamp),
      startDatum = data[index - 1],
      endDatum = data[index],
      interpolate = d3.interpolateNumber(endDatum.value, startDatum.value),
      range = endDatum.time - startDatum.time,
      closest = Math.abs(timestamp % range) / range;
      // if (closest <0.5){
      //   //marker.attr('cx', x(endDatum.time));
      //   marker.attr('cy', y(endDatum.value));
      // }else{
      //   //marker.attr('cx', x(startDatum.time));
      //   marker.attr('cy', y(startDatum.value));
      // }

      valueY = interpolate(Math.abs(timestamp % range) / range);
      marker.attr('cy', y(valueY));
      //marker.attr('cy', 100);
  });

  svg.on("click", function() {
  if (d3.event.defaultPrevented) return; // click suppressed
    var mouse = d3.mouse(this);

    var timestamp = x.invert(mouse[0]),
      index = bisect(data, timestamp),
      startDatum = data[index - 1],
      endDatum = data[index],
      interpolate = d3.interpolateNumber(endDatum.value, startDatum.value),
      range = endDatum.time - startDatum.time,
      closest = Math.abs(timestamp % range) / range;
      if (closest <0.5){
        //marker.attr('cx', x(endDatum.time));
        marker.attr('cy', y(endDatum.value));
      }else{
        //marker.attr('cx', x(startDatum.time));
        marker.attr('cy', y(startDatum.value));
      }
  console.log("clicked!",closest);
});


});

var parseDate = d3.time.format("%H:%M:%S.%L").parse;

function type(d) {
  d.time = new Date(+parseDate(d.time)); //create a date in milliseconds
  d.milli = d.time.getTime();
  d.value = +d.value; 
  return d;
}


