import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'

const {
  getValue,
  getFontWeight,
  getFontStyle,
  getTextTransform,
  getColor,
} = normalizeValues

export default class TypoProcessor extends BaseProcessor{  
  processNode(node){
    const data = {}
    data['font-family'] = `'${node.fontName.family}'`
    data['font-size'] = `rem(${node.fontSize}px)`
    data['font-style'] = getFontStyle(node.fontName.style)
    data['font-weight'] = getFontWeight(node.fontName.style)
    data['line-height'] = getValue(node.lineHeight, 1.2)
    data['letter-spacing'] = getValue(node.letterSpacing, 0)
    data['text-transform'] = getTextTransform(node.textCase)
    data['color'] = getColor(node.fills)
    return data
  }
}