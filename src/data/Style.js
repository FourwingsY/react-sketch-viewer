import Color from './Color'

class Style {

	constructor(layer) {
		this.layer = layer
		this.style = layer.style
	}

	getStyle() {
		return {
			opacity: this.getOpacity(),
			background: this.getBackground(),
			border: this.getBorder(),
			boxShadow: this.getShadow(),
		}
	}

	getOpacity() {
		const context = this.style.contextSettings
		if (!context) {
			return null
		}
		return context.opacity
	}

	getBackground() {
		if (!this.style.fills) {
			return 'transparent'
		}

		const {width, height} = this.layer.frame

		const backgrounds = this.style.fills.map(fill => {
			const {
				isEnabled,
				color, fillType,
				gradient,
				noiseIndex, noiseIntensity,
				patternFillType, patternTileScale
			} = fill

			if (!isEnabled) {
				return null
			}
			if (!gradient) {
				return (new Color(color)).getRgba()
			}

			// gradient
			const {
				elipseLength, // sketch has wrong typo
				from, to, stops,
				gradientType,
			} = gradient

			// linear gradient
			if (gradientType === 0) {
				const pointRegex = /{(.+), (.+)}/
				const [_, startX, startY] = pointRegex.exec(from)
				const [__, endX, endY] = pointRegex.exec(to)

				const angle = Math.atan2(startX - endX, startY - endY)
				const degree = angle * 180 / Math.PI

				const colorStops = stops.map(stop => {
					const color = new Color(stop.color).getRgba()
					const stopAt = `${stop.position * 100}%`
					return `${color} ${stopAt}`
				})

				return `linear-gradient(${degree}deg, ${colorStops.join(',')})`
			}

			// radial gradient
			if (gradientType === 1) {
				let gradientShape = 'circle'
				if (elipseLength !== 1) {
					gradientShape = 'ellipse'
				}

				const pointRegex = /{(.+), (.+)}/
				const [_, startX, startY] = pointRegex.exec(from)
				const [__, endX, endY] = pointRegex.exec(to)

				const gradientSize = Math.max(endY - startY) * height + 'px'
				const gradientPosition = `${startX * 100}% ${startY * 100}%`
				const colorStops = stops.map(stop => {
					const color = new Color(stop.color).getRgba()
					const stopAt = `${stop.position * 100}%`
					return `${color} ${stopAt}`
				})

				return `radial-gradient(${gradientShape} ${gradientSize} at ${gradientPosition}, ${colorStops.join(',')})`
			}
		})
		return backgrounds.join(', ')
	}

	getBorder() {
		if (!this.style.borders) {
			return {thickness: 0, color: new Color()}
		}

		const border = this.style.borders[0]
		if (!border.isEnabled) {
			return {thickness: 0, color: new Color()}
		}

		return `${border.thickness}px solid ${new Color(border.color).getRgba()}`
	}

	getShadow() {
		if (!this.style.shadows) {
			return null
		}
		const {offsetX, offsetY, blurRadius, spread, color} = this.style.shadows[0]
		return `${offsetX}px ${offsetY}px ${blurRadius}px ${spread}px ${new Color(color).getRgba()}`
	}

}

export default Style