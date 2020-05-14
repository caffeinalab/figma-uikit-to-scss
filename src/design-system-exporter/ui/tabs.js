import Component from '@okiba/component'
import { on, off } from '@okiba/dom'

const ui = {
  buttons: '.js-tab-button',
  panels: '.js-tab-panel',
}

export default class Tabs extends Component {
  constructor({el}) {
    super({el, ui})
    this.listen()
    this.activate('pages')
  }

  activate(panelID) {
    if (this.panelID === panelID) {
      return
    }
    this.panelID = panelID

    this.ui.panels.forEach(p => {
      if (p.getAttribute('data-rel') === panelID) {
        p.setAttribute('data-state', 'active')
      } else {
        p.setAttribute('data-state', '')
      }
    })

    this.ui.buttons.forEach(b => {
      if (b.getAttribute('data-rel') === panelID) {
        b.setAttribute('data-state', 'active')
      } else {
        b.setAttribute('data-state', '')
      }
    })
  }

  onButtonClick = e => {
    const button = e.currentTarget
    const panelID = button.getAttribute('data-rel')
    this.activate(panelID)
  }

  listen() {
    on(this.ui.buttons, 'click', this.onButtonClick)
  }

  unListen() {
    off(this.ui.buttons, 'click', this.onButtonClick)
  }

  onDestroy() {
    this.unListen()
  }
}