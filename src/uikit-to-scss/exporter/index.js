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
    // @fil
    // Qui vengono istanziati i vari processori, ho tolto il ciclo per evitare di eseguire il blocco if 4 volte

    this.processors.palette = new processors.palette('palette', this.settings)
    this.processors.typos = new processors.typos('typos', this.settings)
    this.processors.components = new processors.components('components', this.settings)

    if (this.settings.variants) {
      this.processors.variants = new processors.variants('variants', this.settings) 
    } else {
      // Se le variants non sono spuntate, elimino il tipo dalla lista dei tipi di processore così da non far processare le pagine
      // ed evitare l'errore
      this.processorsTypes = this.processorsTypes.filter(type => type !== 'variants')
    }
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