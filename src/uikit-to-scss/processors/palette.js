import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'

const { getColor } = normalizeValues

export default class PaletteProcessor extends BaseProcessor{
  processNode(node){
    return getColor(node.fills)
  }
}