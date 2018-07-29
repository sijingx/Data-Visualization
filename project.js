
//set the margin of the svg
const margin = {top: 20, right:20, bottom: 20, left:40};
const width = 600 - margin.left - margin.right;   
const height = 500 - margin.top - margin.bottom;
const line_width = 400 - margin.left - margin.right;   
const line_height = 500 - margin.top - margin.bottom;   


//parse Date objects
const parseTime = d3.timeParse("%Y")

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

//set x axis number format
var formatAs = d3.format(".2s");


//append scatter plot svg
var svg_scatter = d3.select("#scatterplot")
            .append("svg")
            .attr("class", "scatter")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)           
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " +margin.top + ")")

//append line chart svg
var svg_line = d3.select("#linechart")
                    .append("svg")
                    .attr("class", "line")
                    .attr("width", line_width + margin.left + margin.right)
                    .attr("height", 1/2*(line_height) + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + (margin.left) + ", " +margin.top + ")")

/*var svg_line2 = d3.select("#linechart")
                    .append("svg")
                    .attr("class", "line")
                    .attr("width", line_width + margin.left + margin.right)
                    .attr("height", 1/2*(line_height) + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + ", " +margin.top + ")")
*/
//import data
d3.csv("data.csv", rowConverter, function(d) {
    //get a year list
    const dataset = d;

    const years = d3.nest()
                  .key(function(d) {return d.Year.getFullYear()}).sortKeys(d3.descending)
                  .rollup(function(leaves) {return leaves.length;})
                  .entries(d);

    const yearAsKey = d3.nest()
                      .key(function(d) {return d.Year.getFullYear()}).sortKeys(d3.descending)
                      .sortValues(function(a,b){return d3.ascending(a.CountryName, b.CountryName);})
                      .map(d);

    const regionAsKey = d3.nest()
                      .key(function(d) {return d.Region;}).sortKeys(d3.ascending)
                      .entries(d)

    const regionAsKey2 = d3.nest()
                      .key(function(d) {return d.Region;}).sortKeys(d3.ascending)
                      .rollup(function(leaves) {
                        
                        var year = d3.nest().key(function(d) {return d.Year}).entries(leaves);
                        var median = d3.median(leaves, function(d) {return d.PopulationAbove65})
                        return {Year:year, Median:median}
                        })
                      .entries(d)

        console.log(regionAsKey2)

    const regions = ["East Asia & Pacific", "Europe & Central Asia", "Latin America & Caribbean",
                    "Middle East & North Africa", "North America", "South Asia","Sub-Saharan Africa"];
//for line chart
    const countryAsKey = d3.nest()
                     .key(function(d) {return d.CountryName}).sortKeys(d3.ascending)
                     .map(d)
   
    //set color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10.slice(0,7)).domain(regions);


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
	         .data(yearAsKey.get("2016"), function(d) {return d.CountryName;})
	         .enter()           	         
	         .append("circle")
	         .attr("class", function(d){return "dot "+ d.Region})
             .attr("id", function(d) {return d.CountryName})

	         .attr("cx", function(d) {
	         	return xscale(d.Population);
	         })
	         .attr("cy", function(d) {
	         	return yscale(d.PopulationAbove65);
	         })
             .attr("r", 4)
             
	         /*.attr("r", function(d){
	         	return rscale(d.IncomeGroup);
	         })*/
             
	         .style("fill", function(d){return color(d.Region);})
             .on("mouseover", function(d) {

                d3.select(this)
                  .attr("r", 8)
                  .style("fill", "yellow")
                  .style("stroke-width", "2px")



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
                d3.select("#region-which")
                  .text("Region: "+d.Region)


                d3.select("#tooltip").classed("hidden", false);
             })
             .on("mouseout", function(){
                d3.select("#tooltip").classed("hidden", true);
                d3.select(this).attr("r", 4)
                  .transition("radius")
                  .duration(250)
                  .style("fill", function(d){return color(d.Region)})
                  .style("stroke-width", "1px")
             })
             .on("click", countryChange)

//append scatterplot axis
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


    // append legend           
    var legend = svg_scatter.selectAll(".legend")
                .data(regionAsKey)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })

 
     legend.append("rect")
          .attr("id", function(d){return d.key})
          .attr("x", width -18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", function(d){return color(d.key);})	
          //.on("click", regionChange)

 

    legend.append("text")

          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .style("font-size","11px")
          .text(function(d){return d.key})

    // add an annotation box

    /*svg_scatter.select("#annotation")

               //.select("#message")
               .text("As the year increase, the are more countries passing the line.")
               
*/

    // add a warning line
    svg_scatter.append("line")
               .attr("x1", 0)
               //.attr("x1", xscale(d3.min(d, function(d) {return d.Population})))
               .attr("y1", yscale(15))
               .attr("x2", xscale(d3.max(d, function(d) {return d.Population})))
               .attr("y2", yscale(15))
               .attr("class", "warningline")

    svg_scatter.append("line")
               .attr("x1", 0)
               //.attr("x1", xscale(d3.min(d, function(d) {return d.Population})))
               .attr("y1", yscale(4))
               .attr("x2", xscale(d3.max(d, function(d) {return d.Population}))+100)
               .attr("y2", yscale(4))
               .attr("class", "warningline")


    //set up line chart scales
    var x = d3.scaleTime()
               .domain(d3.extent(dataset, function(d){return d.Year;}))
               .rangeRound([0, line_width]);
    var y = d3.scaleLinear()
                  .domain([0,d3.max(dataset, function(d){return d.PopulationAbove65})])
                  .rangeRound([1/2*line_height, 0])

    //define line generator
    var line = d3.line()
                .x(function(d) {return x(d.Year)})
                .y(function(d) {return y(d.PopulationAbove65)});

    //create line

    
    svg_line.append("g")
            .attr("id", "path")
           .append("path")
            .datum(countryAsKey.get("Japan"))        
            .attr("class", "lines")
            .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
            .attr("d", line);

    //append axis 
    var lxAxis = d3.axisBottom().scale(x);
    var lyAxis = d3.axisLeft().scale(y);

    svg_line.append("g")
      .call(lyAxis)
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      //.text("Population Above 65 (% of Total)");

    svg_line.append("g")
      .attr("transform", "translate(0," + 1/2*line_height + ")")
      .call(lxAxis)
      .append("text")
      .attr("x", line_width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Year")
        .style("fill", "black")

    svg_line.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (line_height / 2))
    .attr("dy", "1em")
    .style("font-size", "11px")
    .text("Population Above 65 (% of Total)"); 

    /*svg_line.append("text")
        .attr("class", "country-title")
            .attr("y", margin.top)
            .attr("x", margion.left)
            .attr("dy", "1em")
            .style("font-size", "11px")
            .text("Population above 65 in Different Countries 1998-2016"); 
*/

    //label

    svg_line.append("text")
          .attr("class", "country-label")
          .attr("x", 1/2 * width)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .style("font-size","8px")
          .text("Japan")
          .style("font-size", "20px")

//set up line chart 2

    /*svg_line2.append("path")
           
            .datum(regionAsKey2)  
      
            .attr("class", "region-line")
            .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
            .attr("d", function(d){
                return line(d.values)
            });

    //append axis 
    var lxAxis = d3.axisBottom().scale(x);
    var lyAxis = d3.axisLeft().scale(y);

    svg_line2.append("g")
      .call(lyAxis)
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      //.text("Population Above 65 (% of Total)");

    svg_line2.append("g")
      .attr("transform", "translate(0," + 1/2*line_height + ")")
      .call(lxAxis)
      .append("text")
      .attr("x", line_width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Year")
        .style("fill", "black")

    svg_line2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (line_height / 2))
    .attr("dy", "1em")
    .style("font-size", "11px")
    .text("Population Above 65 (% of Total)"); 

*/

    
    function yearChange(){

        var newYear = d3.select(this).property('value')


        var new_circle = d3.selectAll("circle")
                           .data(yearAsKey.get(newYear), function(d) {return d.CountryName;})

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
          .style("fill", function(d){return color(d.Region);})
          /*
          .attr("r", function(d){
                return rscale(d.IncomeGroup);
             })
        */
    
        

      }

    function countryChange() {


        var new_country = d3.select(this).attr("id")
        console.log(new_country)
        var new_dataset = countryAsKey.get(new_country);

        var new_path = d3.selectAll(".lines")
                        .datum(new_dataset)
                        .transition().duration(1000)
                        .attr("d", line)

        var new_label = d3.select(".country-label")
                          .text(new_country)

    }

    /*function regionChange() {

        var class_name = d3.select(this).attr("id")

        var active = class_name.active?0:1
        var newOpacity = active? 0:1

        var all_circles = d3.select(".dot").style("opacty", newOpacity)
                          
        var selected_circle = d3.selectAll(".East Asia & Pacific").style("opacity", newOpacity)
        class_name.active = active

    }*/
})

