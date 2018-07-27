
//set the margin of the svg
var margin = {top: 20, right:20, bottom: 20, left:40};
var width = 800 - margin.left - margin.right;   
var height = 500 - margin.top - margin.bottom;



//parse Date objects
var parseTime = d3.timeParse("%Y")

//parse csv
var rowConverter = function(d) {
	return {
		CountryName: d.CountryName,
		Year : parseTime(d.Year),
		PopulationAbove65 : +d.PopulationAbove65,
		Population : +d.Population,
		IncomeGroup : d.IncomeGroup,
		Region : d.Region
	};
}

//set color scale
var color = d3.scaleOrdinal(d3.schemeCategory10);
//set x axis number format
var formatAs = d3.format(".2s");




//append scatter plot svg
var svg_scatter = d3.select("#scatterplot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " +margin.top + ")")

//import data
d3.csv("data.csv", rowConverter, function(d) {
    //get a year list
    const years = d3.nest()
                  .key(function(d) {return d.Year.getFullYear()}).sortKeys(d3.descending)
                  .rollup(function(leaves) {return leaves.length;})
                  .entries(d);

    const yearAsKey = d3.nest()
                      .key(function(d) {return d.Year.getFullYear()}).sortKeys(d3.descending)
                      .sortValues(function(a,b){return ((a.CountryName < b.CountryName)?-1 : 1); return 0;})
                      .map(d);

    var span = d3.select("#select").append("span")
             .text("Choose a year: ")

    var yearInput = d3.select("#select").append('select')
                  .attr("id", "yearSelect")
                  .on("change", yearChange)
                  .selectAll("option")
                  .data(years)
                  .enter()
                  .append('option')
                  .attr('value', function(d){return d.key;})
                  .text(function(d){return d.key;})
	
    // set circle scales			
    var xscale = d3.scaleLog()
                   .domain([d3.min(d, function(d) {return d.Population}), d3.max(d, function(d){return d.Population})])
                   .nice()
                   .range([0, width]);

    var yscale = d3.scaleLinear()
                   .domain([0, d3.max(d, function(d){return d.PopulationAbove65})])
                   .nice()
                   .range([height,0]);

    var rscale = d3.scaleOrdinal()
                   .domain([d, function(d){
                   	return d.IncomeGroup
                   }])
                   .range([2,4,6,8])

    // append circles
	svg_scatter.selectAll("circle")
	         .data(yearAsKey.get("2016"))
	         .enter()           	         
	         .append("circle")
	         .attr("class", "dot")

	         .attr("cx", function(d) {
	         	return xscale(d.Population);
	         })
	         .attr("cy", function(d) {
	         	return yscale(d.PopulationAbove65);
	         })
             .attr("r", 4)
             /*
	         .attr("r", function(d){
	         	return rscale(d.IncomeGroup);
	         })
             */
	         .style("fill", function(d){return color(d.Region);})
             .on("mouseover", function(d) {
                var xPosition = parseFloat(d3.select(this).attr("cx"));
                var yPosition = parseFloat(d3.select(this).attr("cy"));
                d3.select("#tooltip")
                  .style("left", xPosition + "px")
                  .style("top", yPosition + "px")
                  .select("#name")
                  .text(d.CountryName);
                d3.select("#percentage")
                  .text("Percentage of population above 65: "+d.PopulationAbove65);

                d3.select("#total")
                  .text("Total population: "+d.Population)

                d3.select("#year")
                  .text("Year: "+d.Year.getFullYear())

                d3.select("#tooltip").classed("hidden", false);
             })
             .on("mouseout", function(){
                d3.select("#tooltip").classed("hidden", true);
             })


	var xAxis = d3.axisBottom().scale(xscale).ticks(5).tickFormat(formatAs);
	var yAxis = d3.axisLeft().scale(yscale);

	svg_scatter.append("g")
	           .attr("class", "axis")
	           .attr("transform", "translate(0, " + height + ")")
	           .call(xAxis)
	         .append("text")
	           .attr("class", "label")
	           .attr("x", width)
	           .attr("y", -6)
	           .style("text-anchor", "end")
	           .text("Total Population")
	           .style("fill", "black")


                
    var legend = svg_scatter.selectAll(".legend")
                .data(color.domain())
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })

    legend.append("rect")
          .attr("x", width -18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color)	


    legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .style("font-size","8px")
          .text(function(d){return d})


	svg_scatter.append("g")
	           .attr("class", "axis")
	           .call(yAxis)
	           .append("text")
               .attr("class", "label")
               .attr("transform", "rotate(-90)")
               .attr("y", 6)
               .attr("dy", ".71em")
               .style("text-anchor", "end")
               .text("Population Above 65 (% of total)")
               .style("fill", "black")

    
    function yearChange(){

        var newYear = d3.select(this).property('value')

        var new_circle = d3.selectAll("circle")
                           .data(yearAsKey.get(newYear))

          .transition().duration(1000)
          .delay(function(d,i){
            return i*10;
          })          
          .attr("cx", function(d) {
            return xscale(d.Population);
          })
          .attr("cy", function(d) {
            return yscale(d.PopulationAbove65)
          })
          .attr("r", 4)


      }
})

