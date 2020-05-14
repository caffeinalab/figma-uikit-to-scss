import TypoProcessor from './processors/typo'
import PaletteProcessor from './processors/palette'
import ComponentProcessor from './processors/component'

export const uiBreakPoints = ['mobile', 'tablet', 'desktop']
export const componentStates = ['default', 'hover', 'disabled']

export const processors = {
  palette: PaletteProcessor,
  typos: TypoProcessor,
  components: ComponentProcessor
}

export const exportDependencies = {
  typos: 'palette',
  components: 'palette'
}
