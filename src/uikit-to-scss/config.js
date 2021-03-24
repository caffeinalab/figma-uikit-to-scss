import TypoProcessor from './processors/typo'
import PaletteProcessor from './processors/palette'
import ComponentProcessor from './processors/component'
import VariantProcessor from './processors/variant'

export const uiBreakPoints = ['mobile', 'tablet', 'desktop']

export const variantPropsOrder = ['style', 'state', 'size']

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
  variants: VariantProcessor
}

export const exportDependencies = {
  typos: 'palette',
  components: 'palette'
}
