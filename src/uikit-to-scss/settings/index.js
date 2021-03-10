const defaultSettings = {
  'uikit_filename': 'uikit.scss',
  'uikit_prefix': '@uikit',
  'uikit_separator': '-',
  'uikit_palette': 'palette',
  'uikit_typos': 'typo',
  'uikit_components_type': 'components',
  'uikit_components': 'component',
  'uikit_ref_node': 'ref',
  'sass_palette': 'colors',
  'sass_typo': 'typographyVariables',
  'sass_components': 'componentsVariables',
}

export const getSettings = async function(){
  try{
    return await figma.clientStorage.getAsync('uikit-to-scss')
  } catch(err) {
    return defaultSettings
  }
}

export const saveSettings = async function(settings){
  try{
    await figma.clientStorage.setAsync('uikit-to-scss', settings)
  } catch(err) {
    console.log('[DesignSystemExporter] Impossible to save settings', err)
  }
  return true
}