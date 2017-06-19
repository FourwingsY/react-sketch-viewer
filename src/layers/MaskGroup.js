import React from 'react'
import PropTypes from 'prop-types'
import {getPositionStyle} from '../utils/layerUtils'

class MaskGroup extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	static contextTypes = {
		renderLayer: PropTypes.func,
	}

	render() {
		const layer = this.props.layer
		const {name, mask, layers: childLayers} = layer

		const style = {
			...getPositionStyle(layer),
		}

		const maskStyle = {
			position: 'absolute',
			width: '100%',
			height: '100%',
			overflow: 'hidden',
			borderRadius: mask.fixedRadius,
		}

		return (
			<div className='maskGroup' data-sketch-name={name} style={style}>
				<div className='mask' style={maskStyle} >
					{childLayers.map(this.context.renderLayer)}
				</div>
			</div>
		)
	}

}

export default MaskGroup