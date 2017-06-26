import React from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Page from './Page'
import Layer from './Layer'
import SymbolStore from './globals/SymbolStore'

import {axiosJSON} from './utils/axiosUtils'
import {update, traverse} from './utils/layerUtils'

class Document extends React.Component {

	static childContextTypes = {
		renderLayer: PropTypes.func
	}

	getChildContext() {
		return {
			renderLayer: (layer, index) => <Layer key={index} layer={layer} />
		}
	}

	state = {
		document: null,
		currentPage: null,
	}

	async componentDidMount() {
		// load document and all pages
		const document = await axiosJSON.get('document.json')
		let pages = await Promise.all(document.pages.map(page => axiosJSON.get(page._ref)))

		// update mask layer
		pages = pages.map(page =>
			update(page, hasMaskingChild, treatClippingMask)
		)

		// extract symbols
		const symbols = []
		pages.forEach(page =>
			traverse(page, isSymbolMaster, symbol => symbols.push(symbol))
		)
		// and store them into SymbolStore
		SymbolStore.setMasters(symbols)

		document.pages = pages
		this.setState({document, currentPage: document.pages[0]})
	}

	setPage = page => e => {
		this.setState({currentPage: page})
	}

	render() {
		const {document, currentPage} = this.state

		// Do not render while loading pages
		if (!document) {
			return null
		}

		return (
			<div id="document">
				<nav>
					{document.pages.map(this.renderPageNav)}
				</nav>
				<div className="page-viewer">
					<Page page={currentPage} key={currentPage.do_objectID} />
				</div>
			</div>
		)
	}

	renderPageNav = page => {
		return (
			<div
				key={page.do_objectID}
				className={cx("page-nav", {active: this.state.currentPage === page})}
				onClick={this.setPage(page)}
			>
				{page.name}
			</div>
		)
	}

}

function hasMaskingChild(layer) {
	if (!layer.layers) {
		return false
	}
	return !layer.layers.every(layer => !layer.hasClippingMask)
}

function treatClippingMask(layer) {
	const childLayers = layer.layers
	let layers = []
	let maskGroup = null
	for (let childLayer of childLayers) {
		if (childLayer.hasClippingMask) {
			maskGroup = Object.assign({}, childLayer)
			maskGroup.mask = maskGroup.layers[0]
			maskGroup._class = 'maskGroup'
			maskGroup.layers = []
			maskGroup.isVisible = true
		}
		else if (!maskGroup) {
			layers.push(childLayer)
		}
		else if (maskGroup && layer.shouldBreakMaskChain) {
			layers.push(maskGroup)
			maskGroup = null
			layers.push(childLayer)
		}
		else if (maskGroup && !layer.shouldBreakMaskChain) {
			childLayer.frame.x = childLayer.frame.x - maskGroup.frame.x
			childLayer.frame.y = childLayer.frame.y - maskGroup.frame.y
			maskGroup.layers.push(childLayer)
		}
	}
	// at last
	if (maskGroup) {
		layers.push(maskGroup)
	}
	layer.layers = layers
	return layer
}

function isSymbolMaster(layer) {
	return layer._class === 'symbolMaster'
}

export default Document