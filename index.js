class Color {
	static get textColorLightTheme() { return '#000000' };
	static get textColorDarkTheme()  { return '#FFFFFF' };
	static get isDarkTheme() { return document.body.classList.contains('dark-theme') }

	static textColor () {
		return (this.isDarkTheme) ? this.textColorDarkTheme : this.textColorLightTheme;
	}

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

		let cvs = document.createElement('canvas');
		let ctx = cvs.getContext('2d');
		cvs.width = 90;
		cvs.height = 25;

		ctx.fillStyle = color1;
		ctx.fillRect(0, 0, 30, 25);

		ctx.fillStyle = color2;
		ctx.fillRect(60, 0, 30, 25);

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
		ctx.fillStyle = color3;
		ctx.fillRect(30, 0, 30, 25);
		return color3;
	}

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
		return newColor;
	}

	static invertIfDarkTheme(hexColor) {
		return (!this.isDarkTheme) ? hexColor : this.invert(hexColor);
	}
}

class MyChartDefault {
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
					color: Color.textColor(),
				}
			},
			grid: {
				show: true,
				borderColor: Color.textColor() + '20',
			}
		}
	}

	static get_toolbar() {
		return this.default.toolbar;
	}
}

class MyChart extends MyChartDefault {
	constructor(options={}) {
		super(options);
		this.element = document.getElementById(options.id);

		if (options?.series && !(options?.series.length > 0)) throw new Error('Data is empty...');
		if (!this.element) throw new Error(`Cannot find an element with id="${options?.id}"`);

		this.config = {
			yaxis: {
				labels: {
					show: true,
					style: {
						colors: Color.textColor()
					}
				}
			},
			xaxis: {
				labels: {
					show: true,
					hideOverlappingLabels: false,
					style: {
						colors: Color.textColor()
					}
				},
				categories: options?.labels || []
			},
			title: this.default.title,
			grid: this.default.grid,
		};
		if (options?.labels?.x?.isNumber) { this.config.yaxis.labels.style.formatter = (val) => this.#_numberFormatter(val, options?.formatterOptions || {}); }
		if (options?.labels?.y?.isNumber) { this.config.xaxis.labels.style.formatter = (val) => this.#_numberFormatter(val, options?.formatterOptions || {}); }
	}

	draw() {
		this.chart = new ApexCharts(this.element, this.config);
		this.update();
	}

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

	#_numberFormatter(val, options={}) {
		return (options?.before || '') + this.#_getNumber(val) + (options?.after || '');
	}

	#_getNumber(val, minimumFractionDigits=0) {
		return (+val).toLocaleString(undefined, { minimumFractionDigits });
	}
}

class AreaChart extends MyChart {
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
	constructor(options={}) {
		super(options);

		this.config.plotOptions = { bar: { dataLabels: {}} };
		if (options?.horizontal) { this.config.plotOptions.bar.horizontal = options.horizontal; }
		if (options?.columnWidth) { this.config.plotOptions.bar.columnWidth = options.columnWidth; }
		if (options?.funnel) { this.config.plotOptions.bar.isFunnel = options.funnel }

		let possiblePosition = ['top', 'center', 'bottom'];
		if (possiblePosition.includes(options?.position || 'top')) {
			this.config.plotOptions.bar.dataLabels.position = options.position || 'top';
		} else throw new Error(`Position: "${options?.position}" not valid; Accepted: ${possiblePosition.join(', ')}`)
		this.addData('bar', options);
		this.draw();
	}
}

class LineChart extends MyChart {
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
	constructor(options={}) {
		super(options);
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

		this.addData('pie', options);
		this.draw();
	}
}

class DonutChart extends MyChart {
	constructor(options={}) {
		super(options);

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

		this.addData('donut', options);
		this.draw();
	}
}

class PolarAreaChart extends MyChart {
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
	constructor(options={}) {
		super(options);

		this.config.plotOptions = { radialBar: {} };

		if (options?.startAngle) { this.config.plotOptions.radialBar.startAngle = options.startAngle }
		if (options?.endAngle) { this.config.plotOptions.radialBar.endAngle = options.endAngle }


		this.addData('radialBar', options);
		this.draw();
	}
}

class Heatmap extends MyChart {
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