
var margin = {top: 20.5, right: 30, bottom: 30, left: 40.5},
    width = 1400 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

if (params.count){
  var totalPeaks = params.count;
}else{
  var totalPeaks = 10;
}

document.getElementById("peakCount").innerHTML = totalPeaks;
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

d3.csv("../graphs/graph1.csv", type, function(error, data) {

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

  
// Add event listeners/handlers
  svg.on('mouseover', function() {
    marker.style('display', 'inherit');
  }).on('mouseout', function() {
    marker.style('display', 'none');
  }).on('mousemove', function() {
    var mouse = d3.mouse(this);
    var currentPos = mouse[0] - margin.left;

    if (currentPos > 0 && currentPos < width){

    var timestamp = x.invert(currentPos-2),
      index = bisect(data, timestamp),
      startDatum = data[index - 1],
      endDatum = data[index],
      interpolate = d3.interpolateNumber(startDatum.value, endDatum.value),
      range = x(endDatum.time) - x(startDatum.time),
      distance = currentPos - x(startDatum.time);
      closest = distance / range;

      if (closest > 1) {closest = 1}
      valueY = interpolate(closest);

      marker.attr('cx', currentPos);
      marker.attr('cy', y(valueY));
    }
  });

  svg.on("click", function() {
  var removeChecked = document.getElementById("remove").checked;
  if (d3.event.defaultPrevented || removeChecked) return; // click suppressed
    var mouse = d3.mouse(this);
    var currentPos = mouse[0] - margin.left;


    var timestamp = x.invert(currentPos-2),
      index = bisect(data, timestamp),
      startDatum = data[index - 1],
      endDatum = data[index],
      interpolate = d3.interpolateNumber(startDatum.value, endDatum.value),
      range = x(endDatum.time) - x(startDatum.time),
      distance = currentPos - x(startDatum.time);
      closest = distance / range;
      if (closest > 1) {closest = 1}
      valueY = interpolate(closest);

      currentPeaks = d3.selectAll(".userPeak")[0].length;

      if (currentPeaks < totalPeaks){
        //add a circle at a point of selection
        trans.append("circle")
          .attr("class", "userPeak")
          .style("stroke", "gray")
          .style("fill", '#FB5050')
          .attr("r", 7)
          .attr("cx", currentPos)
          .attr("cy", y(valueY))
          .on("click", removeCircle);
      }

    userPeaks = [];
    d3.selectAll(".userPeak").each( function(d, i){
      date = x.invert(d3.select(this).attr("cx"));
      index = bisect(data, date);
      userPeaks.push(index); //find all peaks that the user has indicated and save it in userPeaks array
    });
    //console.log(  userPeaks );
});


});

var parseDate = d3.time.format("%H:%M:%S.%L").parse;

function type(d) {
  d.time = new Date(+parseDate(d.time)); //create a date in milliseconds
  d.milli = d.time.getTime();
  d.value = +d.value; 
  return d;
}

function saveFile(){
  if (userPeaks.length != totalPeaks){
    alert("You didn't mark " + totalPeaks + " peaks yet!");
  } else {
    console.log(userPeaks);
    var d = new Date();
    var n = d.getTime();
    var x = JSON.stringify(userPeaks);
    $.post("savePeak.php", {data : x, refNo: n}, function(){
      window.location.href = "results.html#refNo=" + n;
    });
  }
}



