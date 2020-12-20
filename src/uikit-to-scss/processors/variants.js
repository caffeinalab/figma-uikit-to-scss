import BaseProcessor from './base'
import normalizeValues from '../utils/normalize-values'
import traverseNode from '../utils/traverse-node'
const { getColor, getBorder, getBorderRadius, getPadding } = normalizeValues

export default class VariantsProcessor extends BaseProcessor{
  processNode(node, refSelector){
    const data = {}
    const refNode = traverseNode(node, refSelector) || node
    let cleanNodes = []
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
        data[name + '-' + element.name] = element.value(node)
      });
    })
    
    return data
  }
}