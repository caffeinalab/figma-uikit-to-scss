import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'

const { getColor, getBorder, getBorderRadius, getPadding, getOpacity } = normalizeValues

export default class ComponentProcessor extends BaseProcessor{
  processNode({name, breakpoint}, node){
    if (!this.data[name]) {
      this.data[name] = {}
    }

    if (!this.data[name][breakpoint]) {
      this.data[name][breakpoint] = {}
    }

    
    if(node.children && node.children.length){
      const visibleChild = node.children.find(n => n.visible && n.fills.length > 0)
      if(visibleChild){
        this.data[name][breakpoint]['color'] = getColor(node.fills)
      }
    }
    
    this.data[name][breakpoint]['opacity'] = Math.round(node.opacity * 100) / 100
    this.data[name][breakpoint]['padding'] = getPadding(node)
    this.data[name][breakpoint]['border'] = getBorder(node)
    this.data[name][breakpoint]['border-radius'] = getBorderRadius(node)
    this.data[name][breakpoint]['background-color'] = getColor(node.backgrounds)
  }
}