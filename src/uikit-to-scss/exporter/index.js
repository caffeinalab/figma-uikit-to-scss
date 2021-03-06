import {processors, exportDependencies} from '../config'
import {objToSassMap} from '../utils/obj-to-sass'
import {sendToUI} from '../utils/communication'

export default class Exporter{
  constructor(settings){
    this.processors = {}
    this.settings = settings
    this.processorsTypes = Object.keys(processors)
    this.initProcessors()
    this.process()
    this.downloadFile()
  }

  initProcessors(){
    this.processorsTypes.forEach(type => {
      this.processors[type] = new processors[type](type, this.settings)
    })
  }

  process(){
    const {uikit_prefix, pages: selectedPages} = this.settings
    const pages = figma.root.children.filter(({id}) => selectedPages.includes(id))

    pages.forEach(page => {
      const pageNodes = page.findAll(node => node.name.indexOf(uikit_prefix) >= 0)
      this.processorsTypes.forEach(type => this.processors[type].addNodes(pageNodes))
    });
  }

  prepareFile(){
    let fileData = ''
    this.processorsTypes.forEach(type => {
      const dependency = exportDependencies[type]
      const rules = this.processors[type].getData()
      let data = ''
      data += `// ${type.toUpperCase()} \n`
      data += objToSassMap(rules, this.settings[`sass_${type}`])
      data += `\n`
      if(dependency){
        Object.entries(this.processors[dependency].getData())
          .forEach(([key, value]) => {
            data = data.replace(
              new RegExp(value, 'g'), 
              `map-get($${this.settings[`sass_${dependency}`]}, "${key}")`
            )
          })
      }
      fileData += data
    })
    
    return fileData
  }

  downloadFile() {
    sendToUI({type: 'saveFile', data: {fileName: this.settings.uikit_filename, content: this.prepareFile()}})
  }
}