import React from 'react'
import PropTypes from 'prop-types'
import {getPositionStyle} from '../utils/layerUtils'

class Artboard extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	static contextTypes = {
		renderLayer: PropTypes.func,
	}

	render() {
		const layer = this.props.layer
		const {name} = layer
		let {layers: childLayers} = layer

		const style = {
			...getPositionStyle(layer),
		}

		return (
			<div className="artboard" data-sketch-name={name} style={style}>
				<span className="artboard-name">{name}</span>
				<div className="artboard-contents">
					{childLayers.map(this.context.renderLayer)}
				</div>
			</div>
		)
	}

}

export default Artboard