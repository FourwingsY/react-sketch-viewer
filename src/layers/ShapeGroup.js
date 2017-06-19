import React from 'react'
import PropTypes from 'prop-types'
import Style from '../data/Style'
import SvgStyle from '../data/SvgStyle'
import Path from './Path'
import {getPositionStyle} from '../utils/layerUtils'

class ShapeGroup extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	static contextTypes = {
		renderLayer: PropTypes.func,
		svgContext: PropTypes.object,
	}

	static childContextTypes = {
		svgContext: PropTypes.object,
	}

	getChildContext() {
		return {
			svgContext: this.context.svgContext
				? this.context.svgContext
				: this.isSvgContext() ? this : undefined
		}
	}

	isSvgContext() {
		const childLayers = this.props.layer.layers
		return childLayers.length !== 1 || childLayers[0]._class === 'shapePath'
	}

	render() {
		const layer = this.props.layer
		const {name, layers: childLayers, isVisible} = layer

		if (!isVisible) {
			return null
		}

		const simpleStyle = new Style(layer)
		const svgStyle = new SvgStyle(layer)

		if (this.context.svgContext) {
			const style = {
				...getPositionStyle(layer),
				...svgStyle.getStyle(),
				overflow: 'visible',
			}
			return (
				<g data-sketch-name={name} style={style}>
					{this.renderChildLayers()}
				</g>
			)
		}
		if (this.isSvgContext()) {
			const style = {
				...getPositionStyle(layer),
				...svgStyle.getStyle(),
				overflow: 'visible',
			}
			return (
				<svg data-sketch-name={name} style={style} fillRule='evenodd'>
					{this.renderChildLayers()}
				</svg>
			)
		}

		const style = {
			...getPositionStyle(layer),
			...simpleStyle.getStyle(),
			borderRadius: layer.layers[0]._class === 'oval' ? '50%' : layer.layers[0].fixedRadius + 'px',
			overflow: 'visible',
		}

		// if shapeGroup has a single child layer and it is not a path, use div.
		return (
			<div className='simpleShape' style={style} />
		)
	}

	renderChildLayers() {
		const childLayers = this.props.layer.layers
		// if this layer is just a path group, join the path
		if (childLayers.every(layer => layer._class !== 'shapeGroup')) {
			return (
				<path d={childLayers.map(Path.getPath).join(' ')} />
			)
		}

		return childLayers.map(this.context.renderLayer)
	}

}

export default ShapeGroup