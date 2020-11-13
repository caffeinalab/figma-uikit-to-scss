import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'
import traverseNode from '../utils/traverse-node'
const { getColor, getBorder, getBorderRadius, getPadding, getOpacity } = normalizeValues

export default class VariantProcessor extends BaseProcessor{
  processNode(node, refSelector){
    // const data = {}
    const refNode = traverseNode(node, refSelector) || node
    const data = []
    let cleanNodes = []
    let reducedData = []
    const attributes = [
      {
        name: 'padding',
        value: (node) => getPadding(node)
      },
      {
        name: 'opacity',
        value: (node) => Math.round(node.opacity * 100) / 100
      },
      {
        name: 'border',
        value: (node) => getBorder(node)
      },
      {
        name: 'border-radius',
        value: (node) => getBorderRadius(node)
      },
      {
        name: 'background-color',
        value: (node) => getColor(node.backgrounds)
      },
      {
        name: 'color',
        value: (node) => {
          const visibleChild = node.children.find(n => n.visible && n.fills.length > 0)
          return visibleChild ? getColor(visibleChild.fills) : 'inherit'
        }
      }
    ]
    
    refNode.children.forEach(childNode => {
      const { name } = childNode
      const splittedName = name.split(',')
      const splittedCleanName = splittedName.reduce((acc, item) => {
        const cleaned = item.substring(item.indexOf('=') + 1).toLowerCase();
        
        return [...acc, cleaned]
      }, [])
      
      cleanNodes.push(
        {
          name: splittedCleanName.join('-'),
          node: childNode
        }
      )
    });

    cleanNodes.map(({name, node}) => {
      attributes.forEach(element => {
        reducedData.push({
          [name + '-' + element.name]: element.value(node)
        })
      });
    })
    console.log(reducedData)
    
    // if(node.children && node.children.length){
    //   const visibleChild = node.children.find(n => n.visible && n.fills.length > 0)
    //   // console.log(visibleChild.name)
    //   if(visibleChild){
    //     data['color'] = getColor(visibleChild.fills)
    //   }
    // }
    
    // data['opacity'] = Math.round(refNode.opacity * 100) / 100
    // data['padding'] = getPadding(refNode)
    // data['border'] = getBorder(refNode)
    // data['border-radius'] = getBorderRadius(refNode)
    // data['background-color'] = getColor(refNode.backgrounds)
    
    // console.log({data})
    
    return reducedData
  }
}