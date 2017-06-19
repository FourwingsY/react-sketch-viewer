function getPositionStyle(layer) {
	const {frame, rotation, isFlippedHorizontal, isFlippedVertical} = layer
	let transforms = []

	if (rotation) {
		transforms.push(`rotate(${-rotation}deg)`)
	}
	if (isFlippedHorizontal) {
		transforms.push('scaleX(-1)')
	}
	if (isFlippedVertical) {
		transforms.push('scaleY(-1)')
	}

	const style = {
		position: 'absolute',
		width: frame.width,
		height: frame.height,
		top: frame.y,
		left: frame.x,
		transform: transforms.join(',')
	}

	return style
}

// traverse child and replace layer with it's result
function update(rootLayer, selector, func) {
	let childLayers = rootLayer.layers

	// traverse child
	if (childLayers) {
		childLayers = childLayers.map(layer =>
			update(layer, selector, func)
		)
		rootLayer.layers = childLayers
	}

	// and for the root
	if (selector(rootLayer)) {
		rootLayer = func(rootLayer)
	}

	return rootLayer
}

// traverse child, but do not change the layer tree
function traverse(rootLayer, selector, func) {
	let childLayers = rootLayer.layers

	// traverse child
	if (childLayers) {
		childLayers.forEach(layer =>
			traverse(layer, selector, func)
		)
	}

	// and for the root
	if (selector(rootLayer)) {
		func(rootLayer)
	}
}

export {
	getPositionStyle,
	update,
	traverse,
}