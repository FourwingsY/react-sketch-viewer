import React from 'react'
import PropTypes from 'prop-types'

class Rectangle extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	render() {
		const {frame, path, fixedRadius, rotation} = this.props.layer
		const {width, height, x, y} = frame

		return (
			<rect x={x} y={y} width={width} height={height} rx={fixedRadius} ry={fixedRadius} />
		)
	}

}

export default Rectangle