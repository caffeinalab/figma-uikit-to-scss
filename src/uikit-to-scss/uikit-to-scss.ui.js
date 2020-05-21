import UI from './ui'
import {sendToMain} from './utils/communication'
const ui = new UI({el: document.body})

/* The UI script */
function saveFile({fileName, content}){
  const exportBlob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const blobUrl = URL.createObjectURL(exportBlob)
  const downloadLink = document.createElement('a')
  downloadLink.href = blobUrl
  downloadLink.download = fileName || 'uikit.scss'
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

onmessage = event => {
  // console.log('[UI] from main -> ', event
  let message = event.data.pluginMessage;
  switch(message.type){
    case 'initialData':
      ui.setData(message.data)
      break
    case 'saveFile':
      saveFile(message.data)
      sendToMain({ type: 'quit' })
  }
}
  
sendToMain({ type: 'ready' })