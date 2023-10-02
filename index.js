/**
 * @typedef {Color} Color
 * @typedef {MyChartDefault} MyChartDefault
 * @typedef {MyChart} MyChart
 * @typedef {AreaChart} AreaChart
 * @typedef {BarChart} BarChart
 * @typedef {LineChart} LineChart
 * @typedef {PieChart} PieChart
 * @typedef {DonutChart} DonutChart
 * @typedef {PolarAreaChart} PolarAreaChart
 * @typedef {RadarChart} RadarChart
 * @typedef {ProgressChart} ProgressChart
 * @typedef {HeatmapChart} HeatmapChart
 * */

class Color {
	static get textColorLightTheme() { return '#000000' };
	static get textColorDarkTheme()  { return '#FFFFFF' };
	static get isDarkTheme() { return document.body.classList.contains('dark-theme') }

	/**
	 * @returns {String} Color to be applied on the text based of the current theme (light or dark)
	 */
	static textColor () {
		return (this.isDarkTheme) ? this.textColorDarkTheme : this.textColorLightTheme;
	}

	/**
	 * @param {String} color1 First hex color to blend (the one you get with percentage=0)
	 * @param {String} color2 Second hex color to blend (the one you get with percentage=1)
	 * @param {float} percentage Percentage of mixing between the 2 colors
	 * @return {String} Hex color
	 */
	static blend(color1, color2, percentage) {
		const int_to_hex = function(num) {
			let hex = Math.round(num).toString(16);
			return (hex.length == 1) ? '0'+hex : hex;
		}

		if (color1.length != 4 && color1.length != 7)
			throw new Error('colors must be provided as hexes');
		if (color2.length != 4 && color2.length != 7)
			throw new Error('colors must be provided as hexes');
		if (percentage > 1 || percentage < 0)
			throw new Error('percentage must be between 0 and 1');

		if (color1.length == 4)
			color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
		else
			color1 = color1.substring(1);
		if (color2.length == 4)
			color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
		else
			color2 = color2.substring(1);

		color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
		color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];
		let color3 = [
			(1 - percentage) * color1[0] + percentage * color2[0],
			(1 - percentage) * color1[1] + percentage * color2[1],
			(1 - percentage) * color1[2] + percentage * color2[2]
		];
		color3 = '#' + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);
		return color3;
	}

	/**
	 * @param {String} hexColor Hex color to invert
	 * @returns {String} Hex color
	 */
	static invert(hexColor) {
		if (hexColor.length != 4 && hexColor.length != 7)
			throw new Error('Color must be provided as a hex');
		if (hexColor.length == 4)
			hexColor = '#' + hexColor[1] + hexColor[1] + hexColor[2] + hexColor[2] + hexColor[3] + hexColor[3];
		let colors = hexColor.split('');
		let newColor = '#';
		colors.shift();
		for (let p = 0; p < colors.length; p += 2) {
			let c = colors[p] + colors[p+1];
			let nc = (Math.abs(parseInt(c, 16) - 255)).toString(16)
			newColor += (nc.length == 1) ? '0'+nc : nc
		}
		return newColor.toUpperCase();
	}

	/**
	 * @param {String} hexColor Hex color to invert
	 * @returns {String} Hex color
	 */
	static invertIfDarkTheme(hexColor) {
		return (!this.isDarkTheme) ? hexColor : this.invert(hexColor);
	}

	/**
	 * @param {String} hexColor Hex color to transform to RGB
	 * @returns {Array<r,g,b>} RGB Value of the given hex
	 */
	static hex2rgb(hex) {
		if (hex.length != 4 && hex.length != 7)
			throw new Error('colors must be provided as hexes');
		let vals = hex.split('');
		let newVals = [];
		vals.shift();
		for (let x = 0; x < vals.length; x += (vals.length == 6) ? 2 : 1) {
			newVals.push(parseInt(vals[x] + ((vals.length == 6) ? vals[x+1] : ''), 16));
		}
		return newVals;
	}

	/**
	 * 
	 * @param {int} r R value for the color
	 * @param {int} g G value for the color
	 * @param {int} b B value for the color
	 * @returns {String} Hex color from the given RGB values
	 */
	static rgb2hex(r, g, b) {
		if (!(r >= 0 && r <= 255)) { throw new Error(`Red value must be between 0 and 255, received ${r}`); }
		if (!(g >= 0 && g <= 255)) { throw new Error(`Green value must be between 0 and 255, received ${g}`); }
		if (!(b >= 0 && b <= 255)) { throw new Error(`Blue value must be between 0 and 255, received ${b}`); }
		let hex = [r, g, b].map((item) => { return item.toString(16) }).map((item) => { return (item.length == 1) ? '0'+item : item })
		return ('#' + hex.join('')).toUpperCase();
	}

	/**
	 * @param {String} color Hex of the color 
	 * @param {float} percentage Percentage of Brightness/Shade to apply (positive for brightness, negative for shade)
	 * @returns {String} Hex color with the given filter
	 */
	static shade(color, percentage) {
		if (!(percentage >= -1 && percentage <= 1)) { throw new Error('Percentage must be between -1 and 1')}
		if (percentage > 0) {
			return this.blend(color, '#FFFFFF', percentage);
		}
		if (percentage < 0) {
			return this.blend(color, '#000000', Math.abs(percentage));
		}
		return color;
	}
}

class MyChartDefault {
	/**
	 * @param {object} options ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 */
	constructor(options) {
		this.default = {
			toolbar: {
				show: true,
				tools: {
					download: false
				}
			},
			dataLabels: {
				enabled: options?.showLabels || true
			},
			title: {
				text: options?.title || '<Chart title>',
				align: options?.titleAlign || 'center',
				style: {
					fontSize: options?.titleSize || '18px',
					color: options?.titleColor || Color.textColor(),
				}
			},
			grid: {
				show: options?.grid || true,
				borderColor: options?.gridBorderColor || (Color.textColor() + '20'),
			}
		}
	}
}


class MyChart extends MyChartDefault {
	/**
	 * @param {object} options
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {list<String,number>} options.labels
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * ---
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series **List<Object<key, value>, Number>**The data to add to the chart
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {list<String,number>} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 */
	constructor(options={}) {
		super(options);
		this.element = document.getElementById(options.id);

		if (options?.series && !(options?.series.length > 0)) throw new Error('Data is empty...');
		if (!this.element) throw new Error(`Cannot find an element with id="${options?.id}"`);

		this.config = {
			yaxis: {
				labels: {
					show: options?.showLabelOnYAxis || true,
					style: {
						colors: options?.labelColor || options?.yLabelColor|| Color.textColor()
					}
				}
			},
			xaxis: {
				labels: {
					show: options?.showLabelOnXAxis || true,
					hideOverlappingLabels: false,
					style: {
						colors: options?.labelColor || options?.xLabelColor || Color.textColor()
					}
				},
				categories: options?.labels || []
			},
			title: this.default.title,
			grid: this.default.grid,
		};
		if (options?.labelXisNumber) { this.config.yaxis.labels.style.formatter = (val) => this.#_numberFormatter(val, options?.formatterOptions || {}); }
		if (options?.labelYisNumber) { this.config.xaxis.labels.style.formatter = (val) => this.#_numberFormatter(val, options?.formatterOptions || {}); }
	}

	draw() {
		this.chart = new ApexCharts(this.element, this.config);
		this.update();
	}

	/**
	 * @param {String} type set the type of chart
	 * @param {object} options 
	 * @param {String} options.id
	 * @param {Int} options.height
	 * @param {list<object,Number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * ---
	 * @param {String} options.id **String** HTML Element's ID of chart container
	 * @param {Int} options.height **Int** Set chart height (in pixels)
	 * @param {list<object,Number>} options.series **List<Object,Number>** Set the data for the chart
	 * @param {list<String,any} options.labels **List<String, Any>** Set chart labels
	 * @param {Boolean} options.isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} options.isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} options.debug **Boolean** Enable / Disable debug message on console
	 */
	addData(type, options={}) {
		this.config.chart = {
			id: options?.id,
			type,
			height: options?.height || 350,
			toolbar: this.default.toolbar,
		}
		this.config.series = options?.series || [];
		this.config.labels = options?.labels || [];
		if (options?.debug) {
			console.log('%c Debug ', 'font-weight: bold; background-color: #a00', this)
		}
		if (options?.isXDate) { this.config.xaxis.type = 'datetime'; }
		if (options?.isYDate) { this.config.yaxis.type = 'datetime'; }
	}

	update() {
		this.chart.render();
	}

	/**
	 * @param {Number} val Number to format
	 * @param {object} options 
	 * @param {String} options.before **Boolean** Add a string before the number
	 * @param {String} options.after **Boolean** Add a string after the number
	 * @param {Int} options.minimumFractionDigits **Int** Set the minimum number of fractional digits
	 * @returns {String} Number formatted correctly with also the before and after string (if any)
	 */
	#_numberFormatter(val, options={}) {
		return (options?.before || '') + this.#_getNumber(val, options?.minimumFractionDigits || 0) + (options?.after || '');
	}

	/**
	 * @param {Number} val Number to format
	 * @param {Int} minimumFractionDigits **Int** Set the minimum number of fractional digits
	 * @returns {String} Number formatted correctly
	 */
	#_getNumber(val, minimumFractionDigits=0) {
		return (+val).toLocaleString(undefined, { minimumFractionDigits });
	}
}

class AreaChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * 
	 * { curve: 'smooth' || 'straight' || 'stepline' }
	 * { fillTo: 'origin' || 'end' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * @param {String} options.curve
	 * @param {String} options.fillTo
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Area chart only
	 * ---
	 * @param {String} curve **String** Set the type of line
	 * @param {String} fillTo **String** Set the way you want the charts to be filled
	 */
	constructor(options={}) {
		super(options);
		this.addData('area', options);

		let possibleCurves = ['smooth', 'straight', 'stepline'].sort();
		if (possibleCurves.includes(options?.curve || 'smooth')) {
			this.config.stroke = {
				curve: options?.curve || 'smooth'
			}
		} else throw new Error(`Curve: "${options?.curve}" not valid; Accepted: ${possibleCurves.join(', ')}`)

		this.config.plotOptions = { area: { fillTo: 'origin' } };
		let possibleFillTo = ['origin', 'end'].sort();
		if (possibleFillTo.includes(options?.fillTo || 'origin')) {
			this.config.plotOptions.area.fillTo = options.fillTo;
		} else throw new Error(`FillTo: "${options?.fillTo}" not valid; Accepted: ${possibleFillTo.join(', ')}`)

		this.draw();
	}
}

class BarChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * 
	 * { columnWidth: '70%' }
	 * { position: 'top' || 'center' || 'bottom' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * @param {Boolean} options.horizontal
	 * @param {String} options.columnWidth
	 * @param {Boolean} options.funnel
	 * @param {String} options.position
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Bar chart only
	 * ---
	 * @param {Boolean} horizontal **Boolean** Draw the bars horizontal or vertical
	 * @param {String} columnWidth **String** Set the width of the bars
	 * @param {Boolean} funnel **Boolean** Draw all of the bars from the center to create a funnel
	 * @param {String} position **String** Set the label position
	 */
	constructor(options={}) {
		super(options);
		this.addData('bar', options);

		this.config.plotOptions = { bar: { dataLabels: {}} };
		if (options?.horizontal) { this.config.plotOptions.bar.horizontal = options.horizontal; }
		if (options?.columnWidth) { this.config.plotOptions.bar.columnWidth = options.columnWidth; }
		if (options?.funnel) { this.config.plotOptions.bar.isFunnel = options.funnel }

		let possiblePosition = ['top', 'center', 'bottom'];
		if (possiblePosition.includes(options?.position || 'top')) {
			this.config.plotOptions.bar.dataLabels.position = options.position || 'top';
		} else throw new Error(`Position: "${options?.position}" not valid; Accepted: ${possiblePosition.join(', ')}`)
		
		this.draw();
	}
}

class LineChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * 
	 * { curve: 'smooth' || 'straight' || 'stepline' }
	 * { markersColor: '#000000' }
	 * { markersShape: 'circle' || 'square' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * @param {String} options.curve
	 * @param {Int} options.markers
	 * @param {Int} options.markersHover
	 * @param {String} options.markersColor
	 * @param {String} options.markersShape
	 * @param {Function} options.markersOnClick
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Line chart only
	 * ---
	 * @param {String} curve **String** Set the type of line
	 * @param {Int} markers **Int** Set the size of markers (in pixels)
	 * @param {Int} markersHover **Int** Set the size of the marker when mouse is on top
	 * @param {String} markersColor **String** Set markers color
	 * @param {String} markersShape **String** Set marker's Shape
	 * @param {Function} markersOnClick **Function** Callback that's called if you click a marker
	 */
	constructor(options={}) {
		super(options);
		this.addData('line', options);

		let possibleCurves = ['smooth', 'straight', 'stepline'].sort();
		if (possibleCurves.includes(options?.curve || 'smooth')) {
			this.config.stroke = {
				curve: options?.curve || 'smooth'
			}
		} else throw new Error(`Curve: "${options?.curve}" not valid; Accepted: ${possibleCurves.join(', ')}`)
		this.config.markers = {};
		if (options?.markers) { this.config.markers.size = options?.markers }
		if (options?.markersColor) { this.config.markers.colors = options?.markersColor }
		
		if (['circle', 'square'].includes(options?.markersShape || 'circle')) {
			this.config.markers.shape = options?.markersShape || 'circle'
		} else throw new Error(`Curve: "${options?.markersShape}" not valid; Accepted: circle, square`)

		if (typeof options?.markersOnClick === 'function') {
			if (!this.config?.tooltip) {
				this.config.tooltip = {};
			}
			this.config.tooltip.shared = false;
			this.config.tooltip.intersect = true;
			this.config.markers.onClick = options.markersOnClick;
		}

		if (options?.markersHover) {
			this.config.markers.hover = { size: options.markersHover}
		}

		this.draw();
	}
}

class PieChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * 
	 * { position: 'top' || 'bottom' || 'left' || 'right' }
	 * { align: 'center' || 'left' || 'right' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * @param {Boolean} options.showLegend
	 * @param {String} options.position
	 * @param {String} options.align
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Pie chart only
	 * @param {Boolean} showLegend Enable / Disable the legend
	 * @param {String} position Set legend position
	 * @param {Strin} align Set legend alignment
	 * ---
	 */
	constructor(options={}) {
		super(options);
		this.addData('pie', options);

		this.config.plotOptions = { pie: {} };
		this.config.legend = {};

		if (options?.showLegend) { this.config.legend.show = options.showLegend || true; }
		
		let possiblePosition = ['top', 'bottom', 'left', 'right'].sort()
		if (possiblePosition.includes(options?.position || 'right')) {
			this.config.legend.position = options?.position || 'right'
		} else throw new Error(`Position: "${options?.position}" not valid; Accepted: ${possiblePosition.join(', ')}`)

		let possibleAlign = ['center', 'right', 'left'].sort();
		if (possibleAlign.includes(options?.align || 'center')) {
			this.config.legend.horizontalAlign = options?.align || 'center'
		} else throw new Error(`Align: "${options?.align}" not valid; Accepted: ${possibleAlign.join(', ')}`)

		this.draw();
	}
}

class DonutChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * 
	 * { position: 'top' || 'bottom' || 'left' || 'right' }
	 * { align: 'center' || 'left' || 'right' }
	 * { size: '65%' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * @param {Boolean} options.showLegend
	 * @param {String} options.position
	 * @param {String} options.align
	 * @param {String} options.size
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Donut chart only
	 * @param {Boolean} showLegend Enable / Disable the legend
	 * @param {String} position Set legend position
	 * @param {String} align Set legend alignment
	 * @param {String} size Set the donut hole size
	 * ---
	 */
	constructor(options={}) {
		super(options);
		this.addData('donut', options);

		this.config.legend = {};
		this.config.plotOptions = { pie: { donut: {} } };

		if (options?.size) { this.config.plotOptions.pie.donut.size = options.size; }
		if (options?.showLabels) { this.config.plotOptions.pie.donut.labels = { show: options.showLabel } }

		if (Object.keys(options).includes('showLegend')) { this.config.legend.show = options.showLegend }
		
		let possiblePosition = ['top', 'bottom', 'left', 'right'].sort()
		if (possiblePosition.includes(options?.position || 'right')) {
			this.config.legend.position = options?.position || 'right'
		} else throw new Error(`Position: "${options?.position}" not valid; Accepted: ${possiblePosition.join(', ')}`)

		let possibleAlign = ['center', 'right', 'left'].sort();
		if (possibleAlign.includes(options?.align || 'center')) {
			this.config.legend.horizontalAlign = options?.align || 'center'
		} else throw new Error(`Align: "${options?.align}" not valid; Accepted: ${possibleAlign.join(', ')}`)

		this.draw();
	}
}

class PolarAreaChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * 
	 * { position: 'top' || 'bottom' || 'left' || 'right' }
	 * { align: 'center' || 'left' || 'right' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * @param {Boolean} options.showLegend
	 * @param {String} options.position
	 * @param {String} options.align
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Polar Area chart only
	 * @param {Boolean} showLegend Enable / Disable the legend
	 * @param {String} position Set legend position
	 * @param {Strin} align Set legend alignment
	 * ---
	 */
	constructor(options={}) {
		super(options);
	
		this.config.legend = {};

		if (options?.showLegend) { this.config.legend.show = options.showLegend || true; }
		
		let possiblePosition = ['top', 'bottom', 'left', 'right'].sort()
		if (possiblePosition.includes(options?.position || 'right')) {
			this.config.legend.position = options?.position || 'right'
		} else throw new Error(`Position: "${options?.position}" not valid; Accepted: ${possiblePosition.join(', ')}`)

		let possibleAlign = ['center', 'right', 'left'].sort();
		if (possibleAlign.includes(options?.align || 'center')) {
			this.config.legend.horizontalAlign = options?.align || 'center'
		} else throw new Error(`Align: "${options?.align}" not valid; Accepted: ${possibleAlign.join(', ')}`)

		this.addData('polarArea', options);
		this.draw();
	}
}

class RadarChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Radar chart only
	 * ---
	 */
	constructor(options={}) {
		super(options);
		this.addData('radar', options);

		this.config.plotOptions = { radar: {} };
		this.config.plotOptions.radar.polygons = {
			strokeColor: Color.invertIfDarkTheme('#E8E8E8'),
			fill: {
				colors: [ Color.invertIfDarkTheme('#F8F8F8'), Color.invertIfDarkTheme('#FFFFFF') ]
			}
		}

		delete this.config.grid;
		this.draw();
	}
}

class ProgressChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * 
	 * { position: 'top' || 'bottom' || 'left' || 'right' }
	 * { align: 'center' || 'left' || 'right' }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * @param {Number} options.startAngle
	 * @param {Number} options.endAngle
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Progress chart only
	 * @param {Number} startAngle **Number** Set progress chart starting angle
	 * @param {Number} endAngle **Number** Set progress chart ending angle
	 * ---
	 */
	constructor(options={}) {
		super(options);

		this.config.plotOptions = { radialBar: {} };

		if (options?.startAngle) { this.config.plotOptions.radialBar.startAngle = options.startAngle }
		if (options?.endAngle) { this.config.plotOptions.radialBar.endAngle = options.endAngle }


		this.addData('radialBar', options);
		this.draw();
	}
}

class HeatmapChart extends MyChart {
	/**
	 * @param {object} options
	 * ```js
	 * { titleAlign: 'center' || 'left' || 'right' }
	 * { titleSize: '18px' }
	 * { titleColor: '#000000' }
	 * { gridBorderColor: '#000000AA' }
	 * 
	 * {
	 * 	rangeColor: [
	 * 		{ from: 0,   to: 100, color: '#FFFF00', name: '0-100'   },
	 * 		{ from: 101, to: 200, color: '#FFAA00', name: '101-200' },
	 * 		{ from: 201, to: 300, color: '#FF0000', name: '201-300' },
	 * 	]
	 * }
	 * ```
	 * @param {Boolean} options.showLabel
	 * @param {String} options.title
	 * @param {String} options.titleAlign
	 * @param {String} options.titleSize
	 * @param {String} options.titleColor
	 * @param {Boolean} options.grid
	 * @param {String} options.gridBorderColor
	 * @param {String} options.id
	 * @param {list<object,number>} options.series
	 * @param {list<String,any} options.labels
	 * @param {Boolean} options.showLabelOnXAxis
	 * @param {Boolean} options.showLabelOnYAxis
	 * @param {String} options.labelColor
	 * @param {String} options.xLabelColor
	 * @param {String} options.yLabelColor
	 * @param {Boolean} options.labelXisNumber
	 * @param {Boolean} options.labelYisNumber
	 * @param {Int} options.height
	 * @param {Boolean} options.isXDate
	 * @param {Boolean} options.isYDate
	 * @param {Boolean} options.debug
	 * @param {Boolean} options.useFillColorAsStroke
	 * @param {list<object>} options.rangeColor
	 * ---
	 * @param {Boolean} showLabel  **Boolean** Enable / Disable chart label
	 * @param {String} title **String** Set chart title
	 * @param {String} titleAlign **String** add title alignment;
	 * @param {String} titleSize **String** Set the title font size (in pixel)
	 * @param {String} titleColor **String** Set title color
	 * @param {Boolean} grid **Boolean** Enable / Disable the grid behind the chart
	 * @param {String} gridBorderColor **String** set grid color
	 * @param {String} id **String** HTML Element's ID
	 * @param {list<object,number>} series The data to add to the chart
	 * @param {list<String,any} labels **List<String, Any>** Set chart labels
	 * @param {Boolean} showLabelOnXAxis **Boolean** Enable / Disable label on X Axes
	 * @param {Boolean} showLabelOnYAxis **Boolean** Enable / Disable label on Y Axes
	 * @param {String} labelColor **String** Set a color for label on both axes
	 * @param {String} xLabelColor **String** Set a color for the label on the x axes
	 * @param {String} yLabelColor **String** Set a color for the label on the y axes
	 * @param {Boolean} labelXisNumber **Boolean** Enable / Disable number formatter for x axis
	 * @param {Boolean} labelYisNumber **Boolean** Enable / Disable number formatter for y axis
	 * @param {Int} height **Int** Set chart height (in pixels)
	 * @param {Boolean} isXDate **Boolean** Set labels on the X axis as Datetime
	 * @param {Boolean} isYDate **Boolean** Set labels on the Y axis as Datetime
	 * @param {Boolean} debug **Boolean** Enable / Disable debug message on console
	 * ---
	 * ## Heatmap chart only
	 * @param {Boolean} useFillColorAsStroke **Boolean** Show the stroke with the same color of the content
	 * @param {list<object>} rangeColor **List<object>** Set the color and name for a range of values
	 * ---
	 */
	constructor(options={}) {
		super(options);
		this.addData('heatmap', options);
		this.config.plotOptions = { heatmap: {} };

		if (options?.rangeColor && options.rangeColor.length > 0) {
			this.config.plotOptions.heatmap.colorScale = { ranges: [...options.rangeColor] };
		}

		if (options?.useFillColorAsStroke) {
			this.config.plotOptions.heatmap.useFillColorAsStroke = options.useFillColorAsStroke;
		}
		this.draw();
	}
}