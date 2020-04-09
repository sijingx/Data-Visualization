# Data Visualization
## Population above age of 65 (% of Total) VS. Total Population  

This visualization is written using D3.js from scratch. It includes a scatter plot and line chart. The charts illustrate the trend of total population and percentage of aging popylation above 65 over 200 countries.

## Implementation

First, clone the repository.
Second, using localhost to open "index.html".

## About the viualization

### Hybrid Structure

This narrativa visualization follows a "drill-down story" hybrid structure.The opening scence shows a scatterplot on the left, which illustrates the percentage of aging population above 65 of over 200 countries and their populations for the year 2016, and a line chart on the right showing the percentage of aging population above 65 trend for the years 1998-2016. From here, the users can drill down to explore the visualization. For example:

+ Users can mouse hover the circle and get detailed information about the selected country, including "Country name", "Total Population","The percentage of aging population" etc.
+ Users can click on a particular circle on the scatterplot, and get a line chart on the right for that selected country. Or click on the legend to get only circles representing selected region.
+ Users can use drop down menus to select years and country to see how percentage of aging population above 65 of all regions moves across years, and the trend for different countries.

### Scenes

**Layout:** The layout of the scene consists of two charts. A scatterplot on the left (Population above age of 65 (% of Total) VS. Total Population) and a line chart on the right (Population Above 65 (%) in Different Countries 1998-2016).  
**Design:** The x axis of scatter plot is logrithmic scaled to make circles spread and the x axis extend the range of the data. The y axis of scatter plot is linear scaled, and range is from 0 to max of the data. The x axis of line chart is time scaled, range from 1998 to 2016; the y axis of line chart is linear scaled and range from 0 to max of the dataset. When scenes change with different parameters(year/region for scatterplot and country for line chart), they always follow the same template. The axis of the two chart never change in order to show the transition and difference when parameters change.  

### Annotations

**Annotations on scatterplot:** There are two red warning lines on the plot, each with a message attached to it. This annotation will not clear when the "year" parameter changes the scene so that users can clearly observe which and how the countries pass the warning line across years.  

**Annotations on line chart:** There is an annotation on line chart showing which country the line chart is currently representing. This annotation clears when scene changes as the "country" parameter changes, and then change to the country name representing the new scene. As scene changes, the annotation follows the same template, including the same position and same style.

### Parameters

**"Year"** is used to control the state of scatterplot, users can select different year on top left drop down menu to change scene for scatterplot.  

**"Country"** is used to control both the state of line chart and scatter plot. When users select a country name on drop down menu, the corresponding circle will be highlighted(turns yellow and get bigger), the highlighted circles will not change until users click the message of "click me to restore", so users can compare the relative position of selected countries on the scatter plot. Also users can click circles which represent different countries on scatterplot to change scene for line chart.  

**"Region"** is used to control the state of the scatterplot. Users can click on the legend of scatterplot to select circles representing only the selected region. This state will not change until users click the message of "click me to restore".  

**Current State:** year of "2016" and country of "Afghanistan" control the current state.  

### Triggers

+ Users can select the "year" on top left drop down menu to select the year parameter to change scene on scatterplot. After a year is selected, users can clearly see the circles on the scatter plot moving.Or select country parameter to change scene on line chart. After a country is selected, users can clearly see the line moving upwards or downwards.  
+ Users can click the circles on the scatterplot, to change the scene on line chart, users can clearly see the lines moving upwards or downwards, also the annotation changes.  
+ Users can click the legend on the scatterplot, to change the scene on scatter plot, only the circles representing selected region will appear, all the other circles disappear.  
After manipulating the chart, users can click "click me to restore" to restore the scatter plot to a state of a selected year, with all circles showing and no highlighted circles.  
+ Users can mouse moveover the circles on the scatterplot, and get more details through tooltip. At the same time, the underlining circle got highlighted, turning yellow and getting larger. After mouse moveout the circle, the circle restores to original state.  

### Reference

+ Interactive Data Visualization for the Web, 2nd Edition, by Scott Murray.
+ Data is extracted from ["World bank open data"](https://databank.worldbank.org/home.aspx).




