import Exporter from './exporter'
import {getSettings, saveSettings} from './settings'
import {sendToUI} from './utils/communication'

async function init(){
  const settings = await getSettings() 
  const pages = figma.root.children.map(page => {
    return {id: page.id, name: page.name}
  })
  
  figma.showUI(__html__, { width: 400, height: 400 })
  
  figma.ui.onmessage = message => {
    // console.log('[MAIN] from ui -> ', message)
    switch(message.type){
      case 'ready':
        sendToUI({ type: 'initialData', data: {settings, pages} })
      break
      case 'export':
        new Exporter(message.data)
        saveSettings(message.data)
      break
      case 'quit':
        figma.closePlugin()
      break
    }
  }
}

init()
