export const checkbox = ({id, label, value}) => {
  return `<div><label>
    <input type="checkbox" class="Check" name="${id}[]" value="${value}">
    <span class="Check_indicator"></span>
    <span>${label}</span>
  </label><div>`
}

export const inputText = ({id, label, value}) => {
  return `<div>
    <h4>${label}</h4>
    <input type="text" id="${id}" name="${id}" value="${value}">
  </div>`
}