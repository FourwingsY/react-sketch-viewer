import Color from './Color'

class SvgStyle {

	constructor(layer) {
		this.layer = layer
		this.style = layer.style
	}

	getStyle() {
		return {
			opacity: this.getOpacity(),
			fill: this.getBackground(),
			transform: this.getTransform(),
			...this.getBorder(),
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
				from, to, stops,
				gradientType,
			} = gradient

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
		})
		return backgrounds.join(', ')
	}

	getBorder() {
		if (!this.style.borders) {
			return {strokeWidth: 0, stroke: new Color().getRgba()}
		}

		const border = this.style.borders[0]
		if (!border.isEnabled) {
			return {strokeWidth: 0, stroke: new Color().getRgba()}
		}

		return {
			stroke: new Color(border.color).getRgba(),
			strokeWidth: border.thickness,
		}
	}

	getTransform() {
		const {rotation, isFlippedHorizontal, isFlippedVertical} = this.layer
		let transform = []

		if (rotation) {
			transform.push(`rotate(${-rotation}deg)`)
		}
		if (isFlippedHorizontal) {
			transform.push('scaleX(-1)')
		}
		if (isFlippedVertical) {
			transform.push('scaleY(-1)')
		}

		if (!transform) {
			return null
		}

		return transform.join(',')
	}

}

export default SvgStyle