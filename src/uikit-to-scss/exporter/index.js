import {processors, exportDependencies} from '../config'
import {objToSassMap} from '../utils/obj-to-sass'
import {sendToUI} from '../utils/communication'

export default class Exporter{
  constructor(settings){
    this.processors = {}
    this.settings = settings
    this.processorsTypes = Object.keys(processors).filter(key => key !== 'variants')
    this.initProcessors()
    this.process()
    this.downloadFile()
  }

  initProcessors(){
    const { uikit_components_type: componentsType } = this.settings

    console.log(componentsType)

    this.processors.palette = new processors.palette('palette', this.settings)
    this.processors.typos = new processors.typos('typos', this.settings)
    this.processors.components = new processors[componentsType]('components', this.settings)
  }

  process(){
    const {uikit_prefix, pages: selectedPages} = this.settings
    const pages = figma.root.children.filter(({id}) => selectedPages.includes(id))

    pages.forEach(page => {
      const pageNodes = page.findAll(node => node.name.indexOf(uikit_prefix) >= 0)
      this.processorsTypes.forEach(type => {
        try {
          this.processors[type].addNodes(pageNodes)
        } catch (err) {
          console.log(err)
        }
      })
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