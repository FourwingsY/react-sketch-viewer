class Color {
	constructor(color) {
		// default color: transparent
		if (!color) {
			this.red = 255
			this.green = 255
			this.blue = 255
			this.alpha = 0
			return
		}
		const {red, green, blue, alpha = 1} = color
		this.red = Math.round(red * 255)
		this.green = Math.round(green * 255)
		this.blue = Math.round(blue * 255)
		this.alpha = parseFloat(alpha)
	}
	getRgba() {
		return `rgba(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`
	}
}

export default Color