import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'

const { getColor, getBorder, getBorderRadius, getPadding, getOpacity } = normalizeValues

export default class ComponentProcessor extends BaseProcessor{
  processNode(node){
    const data = {}
    if(node.children && node.children.length){
      const visibleChild = node.children.find(n => n.visible && n.fills.length > 0)
      if(visibleChild){
        data['color'] = getColor(visibleChild.fills)
      }
    }
    
    data['opacity'] = Math.round(node.opacity * 100) / 100
    data['padding'] = getPadding(node)
    data['border'] = getBorder(node)
    data['border-radius'] = getBorderRadius(node)
    data['background-color'] = getColor(node.backgrounds)

    return data
  }
}