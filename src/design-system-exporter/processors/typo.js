import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'

const {
  getValue,
  getFontWeight,
  getFontStyle,
  getTextTransform,
  getColor,
  getOpacity,
} = normalizeValues

export default class TypoProcessor extends BaseProcessor{  
  processNode({name, breakpoint}, node){
    if (!this.data[name]) {
      this.data[name] = {}
    }

    if (!this.data[name][breakpoint]) {
      this.data[name][breakpoint] = {}
    }

    this.data[name][breakpoint]['font-family'] = `'${node.fontName.family}'`
    this.data[name][breakpoint]['font-size'] = `rem(${node.fontSize}px)`
    this.data[name][breakpoint]['font-style'] = getFontStyle(node.fontName.style)
    this.data[name][breakpoint]['font-weight'] = getFontWeight(node.fontName.style)
    this.data[name][breakpoint]['line-height'] = getValue(node.lineHeight, 1.2)
    this.data[name][breakpoint]['letter-spacing'] = getValue(node.letterSpacing, 0)
    this.data[name][breakpoint]['text-transform'] = getTextTransform(node.textCase)
    this.data[name][breakpoint]['color'] = getColor(node.fills)
  }
}