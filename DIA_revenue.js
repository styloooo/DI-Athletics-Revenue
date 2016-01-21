var margin = {top: 50, right: 20, bottom: 50, left: 20},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom,
    barPadding = 15;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .2);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10, "$");

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d){
    if(d.Revenue != 0){
        return '$' + d.Revenue + " million earned in revenue";
      }
    else{
        return 'No revenue';
    }
  })

var svg = d3.select("#frame").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("http://thirawr.github.io/DI-Athletics-Revenue/revenue.csv", type, function(error, data) {
  if (error) throw error;

  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.Revenue; })]);

  svg.append("g")
      .attr("class", "x axis")
      //Edit this to move the x-axis to the right
      .attr("transform", "translate("+ barPadding +"," + height + ")")
      .call(xAxis)
    .selectAll("text")
      .attr("y", 0)
      .attr("x", 9)
      .attr("transform", "rotate(45)")
      .style("text-anchor", "start");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Total earned (in millions)");

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.Year) + barPadding; })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Revenue); })
      .attr("height", function(d) { return height - y(d.Revenue); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);
});

function type(d) {
  d.total = +d.total;
  return d;
}
