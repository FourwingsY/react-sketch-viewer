import React from 'react'
import PropTypes from 'prop-types'
import TextStyle from '../data/TextStyle'
import {
	parseBuffer,
	unarchivePlist,
	simplifyPlist,
} from '../utils/decodeUtils'
import {getPositionStyle} from '../utils/layerUtils'
import {Buffer} from 'buffer'

class Text extends React.Component {

	static propTypes = {
		layer: PropTypes.object,
	}

	render() {
		const layer = this.props.layer
		const {attributedString} = layer

		const textStyle = new TextStyle(layer)

		const style = {
			...getPositionStyle(layer),
			...textStyle.getStyle(),
		}

		const decodedText = decodeText(attributedString.archivedAttributedString)
		const text = decodedText.NSString

		return (
			<span className="text" style={style}>
				{text}
			</span>
		)
	}

}

function decodeText(archived) {
	const buffer = new Buffer(archived._archive, 'base64')
	const plist =  parseBuffer(buffer)[0]
	const unarchived = unarchivePlist(plist)
	const simplified = simplifyPlist(unarchived)
	return simplified
}

export default Text