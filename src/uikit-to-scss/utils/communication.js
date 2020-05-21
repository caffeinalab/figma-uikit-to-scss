export const sendToUI = function(data){
  figma.ui.postMessage(data)
}

export const sendToMain = function(data){
  parent.postMessage({ pluginMessage: data }, '*');
}

