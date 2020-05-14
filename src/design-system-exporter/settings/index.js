const defaultSettings = {
  'uikit_filename': 'uikit.sass',
  'uikit_prefix': '@uikit',
  'uikit_separator': '-',
  'uikit_palette': 'palette',
  'uikit_typos': 'typo',
  'uikit_components': 'component',
  'sass_palette': 'colors',
  'sass_typo': 'typographyVariables',
  'sass_components': 'componentsVariables',
}

export const getSettings = async function(){
  try{
    return await figma.clientStorage.getAsync('design-system-exporter')
  } catch(err) {
    return defaultSettings
  }
}

export const saveSettings = async function(settings){
  try{
    await figma.clientStorage.setAsync('design-system-exporter', settings)
  } catch(err) {
    console.log('[DesignSystemExporter] Impossible to save settings', err)
  }
  return true
}