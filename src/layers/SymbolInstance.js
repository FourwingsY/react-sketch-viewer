import React from 'react'
import PropTypes from 'prop-types'

import SymbolStore from '../globals/SymbolStore'

import {getPositionStyle} from '../utils/layerUtils'

class SymbolInstance extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	static contextTypes = {
		renderLayer: PropTypes.func,
	}

	render() {
		const layer = this.props.layer
		const {name, symbolID} = layer

		const symbol = SymbolStore.getSymbol(symbolID)
		const {layers: childLayers, overrides} = symbol

		const style = {
			...getPositionStyle(layer),
		}

		return (
			<div className='symbol' data-sketch-name={name} style={style}>
				{childLayers.map(this.context.renderLayer)}
			</div>
		)
	}
}

export default SymbolInstance