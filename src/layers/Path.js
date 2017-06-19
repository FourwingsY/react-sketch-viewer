import React from 'react'
import PropTypes from 'prop-types'

class Path extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	static getPath(layer) {
		const {frame, path, booleanOperation, rotation} = layer

		const p = calculateAbsolutePoint(frame, rotation)

		const {points, isClosed} = path
		let endPoints = points.slice().reverse()
		const startPoints = [null, ...endPoints]
		if (isClosed) {
			endPoints.push(endPoints[0])
		}

		const coordinates = startPoints.map((startPoint, i) => {
			const endPoint = endPoints[i]
			const pointRegex = /{(.+), (.+)}/

			// on first path
			if (startPoint === null) {
				const [_0, u, v] = pointRegex.exec(endPoint.point)
				const {x, y} = p(u, v)
				return `M ${x} ${y} `
			}
			// on last path with opened path
			if (!endPoint) {
				return ''
			}

			// curve
			if (startPoint.hasCurveTo && endPoint.hasCurveFrom) {
				const [_0, u0, v0] = pointRegex.exec(startPoint.curveTo)
				const {x: x0, y: y0} = p(u0, v0)
				const [_1, u1, v1] = pointRegex.exec(endPoint.curveFrom)
				const {x: x1, y: y1} = p(u1, v1)
				const [_2, u2, v2] = pointRegex.exec(endPoint.point)
				const {x: x2, y: y2} = p(u2, v2)
				return `C ${x0} ${y0} ${x1} ${y1} ${x2} ${y2} `
			} else {
				const [_2, u, v] = pointRegex.exec(endPoint.point)
				const {x, y} = p(u, v)
				return `L ${x} ${y} `
			}
		})

		const pathData = coordinates.join('') + (isClosed ? 'Z' : '')
		return pathData
	}

	render() {
		const pathData = Path.getPath(this.props.layer)
		return (
			<path d={pathData} />
		)
	}

}

function calculateAbsolutePoint(frame, rotation) {
	return (u, v) => {
		const {x, y, width, height} = frame
		const point = {
			x: (x + u * width).toFixed(3),
			y: (y + v * height).toFixed(3),
		}
		// return point
		if (rotation === 0) {
			return point
		} else {
			const cx = x + width / 2
			const cy = y + height / 2
			return {
				x: cx + (point.x - cx) * Math.cos(deg2Rad(-rotation)) - (point.y - cy) * Math.sin(deg2Rad(-rotation)),
				y: cy + (point.x - cx) * Math.sin(deg2Rad(-rotation)) + (point.y - cy) * Math.cos(deg2Rad(-rotation)),
			}
			// other form
			// return {
			// 	x: cx + ((u - 0.5) * Math.cos(deg2Rad(-rotation)) * width - (v - 0.5) * Math.sin(deg2Rad(-rotation)) * height),
			// 	y: cy + ((u - 0.5) * Math.sin(deg2Rad(-rotation)) * width + (v - 0.5) * Math.cos(deg2Rad(-rotation)) * height),
			// }
		}
	}
}

function deg2Rad(degree) {
	return degree / 180 * Math.PI
}

export default Path