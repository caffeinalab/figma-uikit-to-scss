import { uiBreakPoints, componentStates } from '../config'

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

  removeEqualProperties(base, current){
    Object.keys(current).forEach(propertyName => {
      if (current[propertyName] === base[propertyName]) {
        delete current[propertyName]
      }
    })
    return current
  }

  removeDuplicates(data) {
    Object.keys(data).forEach(key => {
      if(uiBreakPoints.includes(key)){
        if(uiBreakPoints[0] !== key){
          data[key] = this.removeEqualProperties(data[uiBreakPoints[0]], data[key])
        }
      }else if(componentStates.includes(key)){
        data[key] = this.removeDuplicates(data[key])
        if(componentStates[0] !== key && data[componentStates[0]]){
          uiBreakPoints.forEach(breakpoint => {
            if(data[key][breakpoint] && data[componentStates[0]][breakpoint]){
              data[key][breakpoint] = this.removeEqualProperties(
                data[componentStates[0]][breakpoint],
                data[key][breakpoint]
              )
            }
          })
        }
      }else if(typeof data[key] === 'object'){
        data[key] = this.removeDuplicates(data[key])
      }
    })
    
    return data
  }

  // removeDuplicates() {
  //   Object.keys(this.data).forEach(tagName => {
  //     let baseStyle
  //     uiBreakPoints.forEach((breakpoint, i) => {
  //       const currentStyle = this.data[tagName][breakpoint] || {}
  //       if(i === 0){
  //         baseStyle = currentStyle
  //       }else{
  //         this.data[tagName][breakpoint] = this.removeEqualProperties(
  //           baseStyle,
  //           currentStyle
  //         )
  //       }
  //     })
  //   })
  // }

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
    const data = this.processNode(node)
    
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