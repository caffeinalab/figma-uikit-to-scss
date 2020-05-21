import { uiBreakPoints, componentStates } from '../config'

export default class BaseProcessor{
  constructor(type, settings){
    this.settings = settings
    this.type = type
    this.data = {}
    this.selector = this.getSelector()
    this.refSelector = this.getRefSelector()
  }

  getSelector(){
    const { uikit_prefix, uikit_separator } = this.settings
    return uikit_prefix + uikit_separator + this.settings[`uikit_${this.type}`] + uikit_separator
  }
  getRefSelector(){
    const { uikit_prefix, uikit_separator, uikit_ref_node } = this.settings
    return uikit_prefix + uikit_separator + uikit_ref_node
  }

  splitName(name) {
    const data = { name: '', breakpoint: false, state: false }
    const cleanedName = name.replace(this.selector, '').split(this.settings.uikit_separator)
    
    cleanedName.some(namePart => {
      if (uiBreakPoints.includes(namePart)) {
        data.breakpoint = namePart
        // stop loop
        return true
      } else if (componentStates.includes(namePart)) {
        data.state = namePart
      } else {
        if (data.name.length > 0) {
          data.name += '-'
        }
        data.name += namePart
      }
    })
    return data
  }

  removeEqualProperties(data, current, breakpoints = false){
    let baseStyle = {}
    if(breakpoints){
      breakpoints.forEach(breakpoint => {
        baseStyle = Object.assign(baseStyle, data[breakpoint] || {})
      })
    }else{
      baseStyle = data
    }
    Object.keys(current).forEach(propertyName => {
      if (baseStyle && current[propertyName] === baseStyle[propertyName]) {
        delete current[propertyName]
      }
    })
    return current
  }

  removeDuplicates(data) {
    Object.keys(data).forEach(key => {
      if(componentStates.includes(key)){
        data[key] = this.removeDuplicates(data[key])
        const index = componentStates.findIndex(state => key === state)
        if(index > 0){
          let baseStyle = {}
          uiBreakPoints.forEach(breakpoint => {
            baseStyle = Object.assign(baseStyle, data[componentStates[0]] && data[componentStates[0]][breakpoint] ? data[componentStates[0]][breakpoint] : {})
            if(data[key][breakpoint]){
              data[key][breakpoint] = this.removeEqualProperties(
                baseStyle,
                data[key][breakpoint]
              )
            }
          })
        }
      }else if(uiBreakPoints.includes(key)){
        const index = uiBreakPoints.findIndex(breakpoint => key === breakpoint)
        if(index > 0){
          data[key] = this.removeEqualProperties(
            data,
            data[key],
            uiBreakPoints.slice(0, index)
          )
        }
      }else if(typeof data[key] === 'object'){
        data[key] = this.removeDuplicates(data[key])
      }
    })
    
    return data
  }
  getData(){
    return this.data
  }

  addNodes(nodes){
    nodes.forEach(node => this.addNode(node))
    this.data = this.removeDuplicates(this.data)
  }

  addNode(node){
    if(node.name.indexOf(this.selector) < 0){
      return
    }
    const {name, breakpoint, state} = this.splitName(node.name)
    const data = this.processNode(node, this.refSelector)
    
    if(!this.data[name]) this.data[name] = {}

    if(state && breakpoint){
      if(!this.data[name][state]) this.data[name][state] = {}
      this.data[name][state][breakpoint] = data
    }else if (breakpoint){
      this.data[name][breakpoint] = data 
    }else{
      this.data[name] = data
    }
  }

  processNode(node){}
}