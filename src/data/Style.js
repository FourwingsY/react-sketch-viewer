import Color from './Color'

class Style {

	constructor(layer) {
		this.layer = layer
		this.style = layer.style
	}

	getStyle() {
		return {
			opacity: this.getOpacity(),
			...this.getBackground(),
			border: this.getBorder(),
			boxShadow: this.getShadow(),
			...this.getBlur(),
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

		const colorToGradient = color => `linear-gradient(to top, ${color}, ${color})`

		const enabledFills = this.style.fills.filter(fill => fill.isEnabled)

		let backgrounds = []
		let blendModes = []
		let backgroundColor = null

		enabledFills.forEach((fill, index) => {
			const {
				color, fillType,
				gradient,
				noiseIndex, noiseIntensity,
				patternFillType, patternTileScale,
				contextSettings,
			} = fill

			// background color
			if (index === 0 && fillType === 0) {
				backgroundColor = (new Color(color)).getRgba()
				return
			}

			// extract blend mode
			if (!contextSettings) {
				blendModes.push('normal')
			} else {
				switch (contextSettings.blendMode) {
					case 7:
						blendModes.push('overlay')
						break
					case 8:
						blendModes.push('soft-light')
						break
					default:
						blendModes.push('normal')
				}
			}

			// multiple backgrounds can have only one last background-color
			// if this is not the last one, describe color as a gradient
			if (fillType === 0) {
				const bgColor = new Color(color)
				backgrounds.push(`linear-gradient(to top, ${bgColor.getRgba()}, ${bgColor.getRgba()})`)
				return
			}

			// if (fillType === 1) : gradient
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

				backgrounds.push(`linear-gradient(${degree}deg, ${colorStops.join(', ')})`)
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

				backgrounds.push(`radial-gradient(${gradientShape} ${gradientSize} at ${gradientPosition}, ${colorStops.join(', ')})`)
			}
		})

		// describe top-layer color first
		const bgStyle = {
			backgroundImage: backgrounds.reverse().join(', '),
			backgroundBlendMode: blendModes.reverse().join(', '),
			backgroundColor: backgroundColor,
			mixBlendMode: backgrounds.length > 1 ? 'overlay' : '',
		}
		return bgStyle
	}

	getBorder() {
		if (!this.style.borders) {
			return null
		}
		const border = this.style.borders[0]
		if (!border.isEnabled) {
			return null
		}

		return `${parseInt(border.thickness)}px solid ${new Color(border.color).getRgba()}`
	}

	getShadow() {
		if (!this.style.shadows || !this.style.shadows[0].isEnabled) {
			return null
		}
		const {offsetX, offsetY, blurRadius, spread, color} = this.style.shadows[0]
		return `${offsetX}px ${offsetY}px ${blurRadius}px ${spread}px ${new Color(color).getRgba()}`
	}

	getBlur() {
		if (!this.style.blur || !this.style.blur.isEnabled) {
			return {}
		}
		const {center, motionAngle, radius, type} = this.style.blur

		// background blur
		if (type === 3) {
			return {
				WebkitBackdropFilter: `blur(${radius}px)`
			}
		}
	}

}

export default Style