import {uiBreakPoints} from '../config'

export default class BaseProcessor{
  constructor(type, settings){
    this.settings = settings
    this.type = type
    this.data = {}
    this.selector = this.getSelector()
  }

  getSelector(){
    const { uikit_prefix, uikit_separator } = this.settings
    return uikit_prefix + uikit_separator + this.settings[`uikit_${this.type}`] + uikit_separator
  }

  splitName(name) {
    const data = { name: '', breakpoint: 'mobile' }
    const cleanedName = name.replace(this.selector, '').split(this.settings.uikit_separator)
    
    cleanedName.some(namePart => {
      if (uiBreakPoints.includes(namePart)) {
        data.breakpoint = namePart
        return true
      }
      if (data.name.length > 0) {
        data.name += '-'
      }
      data.name += namePart
    })
    return data
  }

  removeDuplicates() {
    Object.keys(this.data).forEach(tagName => {
      const baseStyle = this.data[tagName].mobile
      if (!baseStyle) return
      uiBreakPoints.forEach(breakpoint => {
        if (!this.data[tagName][breakpoint] || breakpoint === 'mobile') {
          return
        }
  
        const style = this.data[tagName][breakpoint]
  
        Object.keys(style).forEach(propertyName => {
          if (style[propertyName] === baseStyle[propertyName]) {
            delete this.data[tagName][breakpoint][propertyName]
          }
        })
      })
    })
  }

  getData(){
    return this.data
  }

  addNodes(nodes){
    nodes.forEach(node => this.addNode(node))
    this.removeDuplicates()
  }

  addNode(node){
    if(node.name.indexOf(this.selector) < 0){
      return
    }
    const normName = this.splitName(node.name)
    this.processNode(normName, node)
  }

  processNode(data, node){}
}