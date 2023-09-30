class Color {
	static get textColorLightTheme() { return '#000000' };
	static get textColorLightTheme() { return '#FFFFFF' };
	static get isDarkTheme() { return document.body.classList.contains('dark-theme') }

	// isDarkTheme() { return document.body.classList.contains('dark-theme'); }
	
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
		const element = document.getElementById('id');
		const isDarkTheme = document.body.classList.contains('dark-theme');

		if (data.length == 0) throw new Error('Data is empty...');
		if (!element) throw new Error(`Cannot find an element with id="${options?.id}"`);
		
		console.log(this.default.toolbar);
		this.config = {
			yaxis: {
				labels: {
					style: {
						colors: Color.textColor()
					}
				}
			},
			xaxis: {
				labels: {
					style: {
						colors: Color.textColor()
					}
				}
			},
			title: this.default.title,
			grid: this.default.grid,
		};
		if (options?.labels?.x?.isNumber) { this.config.yaxis.labels.style.formatter = (val) => this.#_numberFormatter(val, options?.formatterOptions || {}); }
		if (options?.labels?.y?.isNumber) { this.config.xaxis.labels.style.formatter = (val) => this.#_numberFormatter(val, options?.formatterOptions || {}); }
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
	}
}