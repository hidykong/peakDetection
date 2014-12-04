var margin = {top: 20.5, right: 30, bottom: 30, left: 40.5},
    width = 1400 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

if (params.graph){
  var graphNo = params.graph;
}else{
  var graphNo = "7";
}

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

var removeCircle = (function(){
  return function(){  
    var removeChecked = document.getElementById("remove").checked;
    if (removeChecked) {
      console.log("removed");
      d3.select(this).remove();
    }
  }
})();



d3.csv("../graphs/graph" + graphNo + ".csv", type, function(error, data) {
//d3.csv("../graphs/graph7.csv", type, function(error, data) {

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
      .attr("y", 6)
      .attr("dy", "-1.0em")
      .text("Value");

  var path = trans.append("path")
      .datum(data)
      .attr("class", "line")
      .attr("d", line)
    .style('fill', 'none')
    .style('pointer-events', 'none')
    .style('stroke', 'grey')
    .style('stroke-width', '1px');

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

});

function type(d) {
  d.time = +d.time;
  d.value = +d.value; 
  return d;
}

function passCount(){
  count = document.getElementById("count").value;
  if (!count){
    alert("You didn't enter the number of peaks!");
  } else{
    window.location.href = "index2.html#count=" + count + "&graph=" + graphNo;
  }
}



