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
		const decodedText = decodeText(this.layer.attributedString.archivedAttributedString)
		const {
			MSAttributedStringFontAttribute,
			NSColor,
		} = decodedText.NSAttributes

		// TODO: in this case, single text contains multiple styles
		if (!MSAttributedStringFontAttribute) {
			return this.getFontStyle()
		}

		const fontSize = MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute
		const fontFamily = MSAttributedStringFontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute

		const decoder = new TextDecoder('utf8');
		const [red, green, blue, alpha] = decoder.decode(NSColor.NSRGB).split(' ');
		const textColor = new Color({
			red: parseFloat(red),
			green: parseFloat(green),
			blue: parseFloat(blue),
			alpha
		})


		return {
			color: textColor.getRgba(),
			fontSize,
			fontFamily,
		}
	}

	// get style from textStyle.encodedAttributes
	getFontStyle() {
		const fontAttribute = decodeText(this.textStyle.encodedAttributes.MSAttributedStringFontAttribute)
		const fontSize = fontAttribute.NSFontDescriptorAttributes.NSFontSizeAttribute
		const fontFamily = fontAttribute.NSFontDescriptorAttributes.NSFontNameAttribute

		return {
			color: this.getColor(),
			fontSize,
			fontFamily,
		}
	}

	getColor() {
		const NSColor = decodeText(this.textStyle.encodedAttributes.NSColor)
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