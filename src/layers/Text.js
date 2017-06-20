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

		const paragraphStyle = {
			display: 'inline-block',
			overflow: 'hidden',
			...getPositionStyle(layer),
			...textStyle.getParagraphStyle(),
		}

		const decodedTextAttributes = decodeText(attributedString.archivedAttributedString)
		const text = decodedTextAttributes.NSString

		return (
			<p className="text" style={paragraphStyle}>
				{decodedTextAttributes.NSAttributeInfo
					? this.renderSubTexts()
					: <span style={textStyle.getTextStyle()}>{text}</span>
				}
			</p>
		)
	}

	renderSubTexts() {
		const textStyle = new TextStyle(this.props.layer)
		const decodedTextAttributes = decodeText(this.props.layer.attributedString.archivedAttributedString)
		const text = decodedTextAttributes.NSString
		const subStringStyles = decodedTextAttributes.NSAttributeInfo["NS.data"]
		const subTexts = []
		for (let i = 0, s = 0, l = subStringStyles.length / 2; i < l; i++) {
			const charCount = subStringStyles[i * 2]
			const styleIndex = subStringStyles[i * 2 + 1]
			subTexts.push(<span key={i} style={textStyle.getTextStyle(styleIndex)}>{text.slice(s, s + charCount)}</span>)
			s += charCount
		}
		return subTexts
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