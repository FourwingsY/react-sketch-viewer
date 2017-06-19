import React from 'react'
import PropTypes from 'prop-types'

class Ellipse extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	render() {
		console.log("renderEllipse")
		const {frame} = this.props.layer
		const {width, height, x, y} = frame
		const {cx, cy, rx, ry} = {
			cx: x + width / 2,
			cy: y + height / 2,
			rx: width / 2,
			ry: height / 2,
		}

		return (
			<ellipse cx={cx} cy={cy} rx={rx} ry={ry} />
		)
	}

}

export default Ellipse