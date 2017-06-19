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

	// get style from attributedString
	getStyle() {
		let fillColor
		if (this.layer.style.fills) {
			fillColor = new Color(this.layer.style.fills[0].color)
		}

		const style = {
			...this.getTextStyle(),
			...this.getParagraphStyle(),
		}

		if (fillColor) {
			style.color = fillColor.getRgba()
		}

		return style
	}

	getTextStyle() {
		const decodedText = decodeText(this.layer.attributedString.archivedAttributedString)
		let {
			MSAttributedStringFontAttribute,
			NSColor,
		} = decodedText.NSAttributes

		// TODO: in this case, single text contains multiple styles
		if (!MSAttributedStringFontAttribute) {
			const {
				MSAttributedStringFontAttribute,
				NSColor,
				// NSKern,
				// NSParagraphStyle,
			} = this.textStyle.encodedAttributes

			const fontAttribute = decodeText(MSAttributedStringFontAttribute)
			const fontSize = fontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute
			const fontFamily = fontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute
			return {
				color: this.decodeColor(NSColor),
				fontSize,
				fontFamily,
			}
		}

		const fontSize = MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute
		const fontFamily = MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute

		return {
			color: this.decodeColor(NSColor),
			fontSize,
			fontFamily,
		}
	}

	// get style from textStyle.encodedAttributes
	getParagraphStyle() {
		const {
			// MSAttributedStringFontAttribute,
			// NSColor,
			NSKern,
			NSParagraphStyle,
		} = this.textStyle.encodedAttributes

		// const fontAttribute = decodeText(MSAttributedStringFontAttribute)
		// const fontSize = fontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute
		// const fontFamily = fontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute

		const paragraphStyle = decodeText(NSParagraphStyle)
		console.log(paragraphStyle)
		let textAlign
		switch(paragraphStyle.NSAlignment) {
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
		let lineHeight = paragraphStyle.NSMaxLineHeight

		return {
			textAlign,
			lineHeight: lineHeight ? `${lineHeight}px` : undefined,
		}
	}

	decodeColor(NSColor) {
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