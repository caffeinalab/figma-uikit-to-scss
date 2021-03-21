import {qs, qsa, on} from '@okiba/dom'
import Component from '@okiba/component'
import Tabs from './tabs'
import {checkbox, inputText} from '../utils/form-elements'
import {sendToMain} from '../utils/communication'

const ui = {
  pages: '.Pages',
  form: 'form',
  submit: 'button'
}

const components = {
  tabs: {
    ghost: true,
    type: Tabs
  }
}

export default class UI extends Component{
  constructor({el}){
    super({el, ui, components})
    this.listen()
  }

  listen(){
    on(this.ui.form, 'submit', this.onSubmit)
  }

  setData({settings = {}, pages = []}){
    this.updatePages(pages)
    this.updateSettings(settings)
  }

  updatePages(pages){
    let checkboxes = ''
    pages.forEach( ({id:value, name:label}) => {
      checkboxes += checkbox({id: 'pages', label, value})
    })
    this.ui.pages.innerHTML = checkboxes
  }

  updateSettings(settings){    
    Object.entries(settings).forEach(([key,value]) => {
      const input = qsa(`input[name="${key}"`)
      if(input && input.length) {
        input.forEach(el => {
          if(el.type === 'radio') {
              el.checked = el.value === value
          } else {
            el.value = value
          }            
        })
      }
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData)
    const pagesSelected = qsa('input[name="pages[]"]:checked')
    
    delete data['pages[]']
    
    data.pages = []
    for (let i = 0, l = pagesSelected.length; i < l;  i++)   {
      data.pages.push(pagesSelected[i].value)
    }

    sendToMain({type: 'export', data})
  }
}
