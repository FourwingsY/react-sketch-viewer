import React from 'react'
import PropTypes from 'prop-types'
import Style from '../data/Style'
import {getPositionStyle} from '../utils/layerUtils'

class Bitmap extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	render() {
		const layer = this.props.layer
		const {name, image} = layer
		if (!image || !image._ref) {
			return null
		}

		const style = {
			...getPositionStyle(layer),
			...new Style(layer).getStyle(),
		}

		// TODO: support other image formats
		const src = `./target/${image._ref}.png`

		return (
			<img className="bitmap" style={style} data-sketch-name={name} src={src} />
		)
	}

}

export default Bitmap