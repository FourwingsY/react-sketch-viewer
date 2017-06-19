import React from 'react'

import Artboard from './layers/Artboard'
import LayerGroup from './layers/LayerGroup'
import MaskGroup from './layers/MaskGroup'
import ShapeGroup from './layers/ShapeGroup'
import SymbolInstance from './layers/SymbolInstance'
import Bitmap from './layers/Bitmap'
import Ellipse from './layers/Ellipse'
import Path from './layers/Path'
import Rectangle from './layers/Rectangle'
import Text from './layers/Text'

function Layer(props) {
	const {layer} = props
	switch(layer._class) {
		case 'artboard':
		case 'symbolMaster':
			return <Artboard layer={layer} />
		case 'group':
			return <LayerGroup layer={layer} />
		case 'maskGroup':
			return <MaskGroup layer={layer} />
		case 'shapeGroup':
			return <ShapeGroup layer={layer} />
		case 'symbolInstance':
			return <SymbolInstance layer={layer} />
		case 'text':
			return <Text layer={layer} />
		case 'bitmap':
			return <Bitmap layer={layer} />
		case 'mask':
			return <Mask layer={layer} />
		case 'rectangle':
			return <Rectangle layer={layer} />
		case 'oval':
			return <Ellipse layer={layer} />
		case 'shapePath':
			return <Path layer={layer} />
		default: {
			console.log(`${layer._class} is not supported`)
			return null
		}
	}
}

export default Layer