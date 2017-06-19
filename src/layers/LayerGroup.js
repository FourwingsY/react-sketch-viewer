import React from 'react'
import PropTypes from 'prop-types'
import Color from '../data/Color'
import {getPositionStyle} from '../utils/layerUtils'

class LayerGroup extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	static contextTypes = {
		renderLayer: PropTypes.func,
	}

	render() {
		const layer = this.props.layer
		const {name, background, layers: childLayers} = layer

		const style = {
			...getPositionStyle(layer),
			background: (new Color(background)).getRgba()
		}

		return (
			<div className='group' data-sketch-name={name} style={style}>
				{childLayers.map(this.context.renderLayer)}
			</div>
		)
	}

}

export default LayerGroup