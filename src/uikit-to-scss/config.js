import TypoProcessor from './processors/typo'
import PaletteProcessor from './processors/palette'
import ComponentProcessor from './processors/component'
import VariantsProcessor from './processors/variants'

export const uiBreakPoints = ['mobile', 'tablet', 'desktop']
export const componentStates = [
  'default',
  'hover',
  'disabled',
  'focus',
  'value',
  'placeholder',
  'success',
  'error'
]

export const processors = {
  palette: PaletteProcessor,
  typos: TypoProcessor,
  components: ComponentProcessor,
  variants: VariantsProcessor
}

export const exportDependencies = {
  typos: 'palette',
  components: 'palette',
  variants: 'palette'
}
