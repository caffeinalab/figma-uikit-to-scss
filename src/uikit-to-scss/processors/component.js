import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'
import traverseNode from '../utils/traverse-node'
const { getColor, getBorder, getBorderRadius, getPadding, getOpacity } = normalizeValues

export default class ComponentProcessor extends BaseProcessor{
  processNode(node, refSelector){
    const data = {}
    const refNode = traverseNode(node, refSelector) || node
    
    if(node.children && node.children.length){
      const visibleChild = node.children.find(n => n.visible && n.fills.length > 0)
      if(visibleChild){
        data['color'] = getColor(visibleChild.fills)
      }
    }
    
    data['opacity'] = Math.round(refNode.opacity * 100) / 100
    data['padding'] = getPadding(refNode)
    data['border'] = getBorder(refNode)
    data['border-radius'] = getBorderRadius(refNode)
    data['background-color'] = getColor(refNode.backgrounds)

    return data
  }
}