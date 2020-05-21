const objToArray = function(obj, prefix = '$') {
  let data = []
  Object.keys(obj).sort().forEach((key) => {
    if(Array.isArray(obj[key])){
      data.push( `"${prefix}${key}": (\n${obj[key].join(', \n')}\n)`)
    }else if(typeof obj[key] === 'object'){
      const subdata = objToArray(obj[key], prefix+key+'-').join(',\n')
      if(subdata.length){
        data.push(subdata)
      }
    } else{
      data.push( `"${prefix}${key}": ${obj[key]}`)
    }
  })
  return data
}

export const objToSassMap = function(obj, listName) {
  let fileContent = `$${listName}: (\n`
  fileContent += objToArray(obj, '').join(',\n')
  fileContent += '\n);\n'
  return fileContent
}