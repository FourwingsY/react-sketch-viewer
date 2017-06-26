import {Buffer} from 'buffer'
import Color from './Color'
import {
	parseBuffer,
	unarchivePlist,
	simplifyPlist,
} from '../utils/decodeUtils'

class TextStyle {

	constructor(layer) {
		this.layer = layer
		this.textStyle = layer.style.textStyle
	}

	_getStyle(attributes) {
		const {
			MSAttributedStringFontAttribute,
			NSColor,
			NSKern,
			NSParagraphStyle,
			NSLigature,
		} = attributes

		const fontSize = MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute
		const fontFamily = MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute
		let textAlign
		switch(NSParagraphStyle.NSAlignment) {
			case 1: {
				textAlign = 'left'
				break
			}
			case 2: {
				textAlign = 'center'
				break
			}
			case 3: {
				textAlign = 'right'
				break
			}
		}
		let lineHeight = NSParagraphStyle.NSMaxLineHeight

		const style = {
			color: this.decodeColor(NSColor),
			fontSize,
			fontFamily,
			textAlign,
			lineHeight: lineHeight ? `${lineHeight}px` : undefined,
			letterSpacing: `${NSKern}px`,
			whiteSpace: 'pre-wrap',
		}

		if (this.layer.style.fills) {
			let fillColor = new Color(this.layer.style.fills[0].color)
			style.color = fillColor.getRgba()
		}

		return style
	}

	// get style from textStyle.encodedAttributes
	getParagraphStyle() {
		const {
			MSAttributedStringFontAttribute,
			NSColor,
			NSKern,
			NSParagraphStyle,
		} = this.textStyle.encodedAttributes

		const fontAttribute = decodeText(MSAttributedStringFontAttribute)
		const paragraphStyle = decodeText(NSParagraphStyle)

		return this._getStyle({
			MSAttributedStringFontAttribute: fontAttribute,
			NSColor,
			NSKern,
			NSParagraphStyle: paragraphStyle,
		})
	}

	getTextStyle(styleIndex = null) {
		const decodedTextAttributes = decodeText(this.layer.attributedString.archivedAttributedString)
		const {
			NSAttributes,
		} = decodedTextAttributes

		// has single subText: NSAttributes is an object
		if (styleIndex === null) {
			return this._getStyle(NSAttributes)
		}

		// has many subText: NSAttributes["NS.objects"] is an array of attribute
		const textAttribute = NSAttributes["NS.objects"][styleIndex]
		return this._getStyle(textAttribute)
	}

	decodeColor(NSColor) {
		if (!NSColor) {
			return null
		}
		const decoder = new TextDecoder('utf8');
		const [red, green, blue, alpha] = decoder.decode(NSColor.NSRGB).split(' ');
		const textColor = new Color({
			red: parseFloat(red),
			green: parseFloat(green),
			blue: parseFloat(blue),
			alpha
		})
		return textColor.getRgba()
	}

}

function decodeText(archived) {
	const buffer = new Buffer(archived._archive, 'base64')
	const plist =  parseBuffer(buffer)[0]
	const unarchived = unarchivePlist(plist)
	const simplified = simplifyPlist(unarchived)
	return simplified
}

export default TextStyle