# Apexchart Utils

- Charts
	- [Options for all charts](#options)
	- [Line chart](#linechart)
	- [Area chart](#areachart)
	- [Bar chart](#barchart)
	- [Pie chart](#piechart)
	- [Donut chart](#donutchart)
	- [Polar Area chart](#polarareachart)
	- [Radar chart](#radarchart)
	- [Heatmap chart](#heatmapchart)
- [Color class](#color-class)
	- [Blend](#blend-colors)
	- [Invert](#invert-color)
	- [HEX to RGB](#hex-to-rgb)
	- [RGB to HEX](#rgb-to-hex)
	- [Shade](#shade-of-color)

## Options
These option parameters are all available on all types of charts

(Colors added here are NOT the default value, these are just an example)
```js
const commonOptions = {
	id: '...', // HTML element's id that will contains this chart
	series: [...], // List of data to be displayed on the chart
	labels: [...], // Labels for the data given
	showLabels: true || false, // Show chart labels
	labelXisNumber: true || false, // This will call the number formatter for the x axis
	labelYisNumber: true || false, // This will call the number formatter for the y axis
	showLabelOnXAxis: true || false, // Show or disable label on the X axis
	showLabelOnYAxis: true || false, // Show or disable label on the Y axis
	labelColor: '#0A0A0A', // Set both label color
	xLabelColor: '#0A0A0A', // Set color only for the label on the X Axis
	yLabelColor: '#0A0A0A', // Set color only for the label on the Y Axis
	formatterOptions: {
		before: '',	// String that will be added before the number
		after: '', // String that will be added after the number
		minimumFractionDigits: 2 // Minimum number of fraction digits
	},
	height: 350, // Height of the chart
	debug: true || false, // Show a message on the console with all of the charts options, config and data
	isXDate: true || false, // Convert the X label to Datetime
	isYDate: true || false, // Convert the Y label to Datetime
	title: 'title', // Set chart title
	titleAlign: 'center' || 'left' || 'right', // Add title alignment
	titleSize: '18px', // Set the title font size
	titleColor: '#FFAA00', // Set the title color
	grid: true || false, // Show or not the grid
	gridBorderColor: '#AA00FF', // Set grid borders color
};
```

## LineChart 
This options are available for all kinds of charts
```js
const uniqueOptions = {
	...commonOptions,
	curve: 'smooth' || 'straight' || 'stepline', // Specify the type of line
	markers: 5, // Size of markers (pixels)
	markersHover: 7, // Size of the marker when mouse is over
	markersColor: '#FF0000', // Color the markers
	markersShape: 'circle' || 'square', // Set markers shape
	markersOnClick: (event) => { console.log(event) }, // Function to be called when you click on a marker
}
let line = new LineChart(uniqueOptions);
```

## AreaChart
```js
const uniqueOptions = {
	...commonOptions,
	curve: 'smooth' || 'straight' || 'stepline', // Specify the type of line
	fillTo: 'origin' || 'end', // Select how the area should be colored; From the origin: 'origin', form the bottom of the chart: 'end'
}
let area = new AreaChart(uniqueOptions);
```

## BarChart
```js
const uniqueOptions = {
	...commonOptions,
	horizontal: true || false, // Draw the bars horizontal or vertical
	columnWidth: '70%', // Set the width of the bar,
	funnel: true || false, // Draw all of the bars from the center to create a funnel
	position: 'top' || 'center' || 'bottom', // Set the labels position

}
let bar = new BarChart(uniqueOptions);
```

## PieChart
```js
const uniqueOptions = {
	...commonOptions,
	showLegend: true || false, // Show or disable the legend
	position: 'top' || 'bottom' || 'left' || 'right', // Set legend position
	align: 'center' || 'left' || 'right', // Set legend alignment

}
let pie = new PieChart(uniqueOptions);
```

## DonutChart
```js
const uniqueOptions = {
	...commonOptions,
	showLegend: true || false, // Show or disable the legend
	position: 'top' || 'bottom' || 'left' || 'right', // Set legend position
	align: 'center' || 'left' || 'right', // Set legend alignment
	size: '65%', // Set the donut hole size
}
let donut = new DonutChart(uniqueOptions);
```
## PolarAreaChart
```js
const uniqueOptions = {
	...commonOptions,
	showLegend: true || false, // Show or disable the legend
	position: 'top' || 'bottom' || 'left' || 'right', // Set legend position
	align: 'center' || 'left' || 'right', // Set legend alignment
}
let polarArea = new PolarAreaChart(uniqueOptions);
```

## RadarChart
```js
const uniqueOptions = {
	...commonOptions,
}
let radar = new RadarChart(uniqueOptions);
```

## ProgressChart
```js
const uniqueOptions = {
	...commonOptions,
	startAngle: 0, // Set progress chart start angle
	endAngle 360, // Set progress chart end angle
}
let progress = new ProgressChart(uniqueOptions);
```

## HeatmapChart
```js
const rangeColorParam = [
	{ from: 0,   to: 100, color: '#FFFF00', name: '0-100'   },
	{ from: 101, to: 200, color: '#FFAA00', name: '101-200' },
	{ from: 201, to: 300, color: '#FF0000', name: '201-300' },
]
const uniqueOptions = {
	...commonOptions,
	rangeColor: rangeColorParam
	useFillColorAsStroke: true || false, // Show the stroke with the same color of the contnet
}
let heatmap = new HeatmapChart(uniqueOptions);
```


# Color class
## Blend colors
Blends 2 colors by a percentage
```js
console.log(Color.blend('#FF0000', '#00FF00', 0.5));
>>> #808000
```

## Invert color
Invert the color
```js
console.log(Color.invert('#123123'));
>>> #EEDDCC
```

## HEX to RGB
```js
console.log(Color.hex2rgb('#FFAA00'));
>>> [255, 170, 0]
```

## RGB to HEX
```js
let r = 100;
let g = 50;
let b = 200;
console.log(Color.rgb2hex(r, g, b))
>>> #6432C8
```


## Shade of color
```js
let hexColor = '#FF0000';
console.log(Color.shade(hexColor, 0.2)); // Makes the color 20% lighter
>>> #ff3333
console.log(Color.shade(hexColor, -0.2)); // Makes the color 20% darker
>>> #cc0000
```