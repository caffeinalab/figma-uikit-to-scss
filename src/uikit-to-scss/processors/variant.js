import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'
import traverseNode from '../utils/traverse-node'
const { getColor, getBorder, getBorderRadius, getPadding } = normalizeValues

const attributes = {
  'padding': node => getPadding(node),
  'opacity': node => Math.round(node.opacity * 100) / 100,
  'border': node => getBorder(node),
  'border-radius': node => getBorderRadius(node),
  'background-color': node => getColor(node.backgrounds),
  'color': node => {
    const visibleChild = node.children
      ? Array.from(node.children).find(n => n.visible && n.fills.length > 0)
      : null
    return visibleChild ? getColor(visibleChild.fills) : 'inherit'
  }
}

export default class VariantProcessor extends BaseProcessor{
  processNode(node, refSelector){
    const refNode = traverseNode(node, refSelector) || node

    if (!refNode.children) return {}

    return Array.from(refNode.children).reduce((attrs, childNode) => {
      return Object.assign(attrs, this.processChildNode(childNode))
    }, {})
  }

  processChildNode(node) {
    return Object.entries(attributes).reduce((attrs, [name, filter]) => {
      const attr = this.getAttribute(node, name, filter)
      return Object.assign(attrs, attr)
    }, {})
  }

  getAttribute(node, name, filter) {
    const id = node.name.split(',').map(entry => {
      const equalSignIndex = entry.indexOf('=')
      const frag = (equalSignIndex > -1) ? entry.substring(equalSignIndex + 1) : entry
      return frag.toLowerCase()
    }).join('-')

    return { [`${id}-${name}`]: filter(node) }
  }
}