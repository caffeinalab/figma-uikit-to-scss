function getValue(data, autoValue = false){
  if (data.unit === 'AUTO') {
    return autoValue
  } else if (data.unit === 'PERCENT') {
    return `${data.value/100}em`
  } else{
    return `rem(${data.value}px)`
  }
}

function getFontWeight(data){
  if(data.indexOf("Thin") >= 0){
    return 100
  }else if(data.indexOf("Light") >= 0){
    return 300
  }else if(data.indexOf("Regular") >= 0){
    return 400
  }else if(data.indexOf("Medium") >= 0){
    return 500
  }else if(data.indexOf("Bold") >= 0){
    return 700
  }else if(data.indexOf("Black") >= 0){
    return 800
  }else {
    return 400
  }
}

function getFontStyle(data){
  return data.indexOf('Italic') < 0 ? 'normal' : 'italic'
}

function getTextTransform(data){
  if(data == "ORIGINAL"){
    return 'none'
  }else if(data == "UPPER"){
    return 'uppercase'
  }else if(data == "LOWER"){
    return 'lowercase'
  }else if(data == "TITLE"){
    return 'capitalize'
  }else {
    return 'none'
  }
}

function intToHex (rgb) { 
  var hex = Number(~~rgb).toString(16);
  if (hex.length < 2) {
    hex = "0" + hex;
  }
  return hex;
}

function rgbToHex(color) {  
  var red = intToHex(255*color.r);
  var green = intToHex(255*color.g);
  var blue = intToHex(255*color.b);
  return '#'+red+green+blue;
}

function getColor(data){
  if(!Array.isArray(data) || data.length === 0){
    return 'inherit'
  }else{
    const opacity = getOpacity(data)
    if(opacity === 1){
      return rgbToHex(data[0].color)
    }else{
      return `rgba(${data[0].color.r},${data[0].color.g},${data[0].color.b},${opacity})`
    }
  }
}

function getOpacity(data){
  if(!Array.isArray(data) || data.length === 0){
    return 1
  }else{
    return ~~(data[0].opacity *100)/100
  }
}

function getBorder(data){
  if(data.strokes.length && data.strokes[0].type === "SOLID"){
    const color = getColor(data.strokes)
    const stroke = data.strokeWeight
    const style = data.dashPattern.length > 0 ? 'dashed' : 'solid'
    return `rem(${stroke}px) ${style} ${color}`
  }else{
    return 'none';
  } 
}

function getBorderRadius(data){
  if(data.topLeftRadius
    && data.topRightRadius
    && data.bottomLeftRadius
    && data.bottomRightRadius) {
    return `rem(${data.topLeftRadius}px)`
  }else if( data.topLeftRadius === data.bottomRightRadius 
    && data.topRightRadius === data.bottomLeftRadius) {
    return `rem(${data.topLeftRadius}px ${data.topRightRadius}px)`
  }else{
    return `rem(${data.topLeftRadius}px ${data.topRightRadius}px ${data.bottomRightRadius}px ${data.bottomLeftRadius}px)`
  } 
}

function getPadding(data){
  // @fil
  // Faccio tornare tutti e quattro i valori senza fare i vari if per raggrupparli (top/bottom, left/right)
  return `rem(${data.paddingTop || 0}px ${data.paddingRight || 0}px ${data.paddingBottom || 0}px ${data.paddingLeft || 0}px)`
}

export default {
  getValue,
  getFontWeight,
  getFontStyle,
  getTextTransform,
  intToHex,
  rgbToHex,
  getColor,
  getOpacity,
  getPadding,
  getBorder,
  getBorderRadius,
}