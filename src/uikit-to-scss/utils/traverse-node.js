function traverseNode(node, toMatch){
  if(node.name == toMatch){
    return node;
  }else if (node.children != null){
    var i;
    var result = null;
    for(i=0; result == null && i < node.children.length; i++){
          result = traverseNode(node.children[i], toMatch);
    }
    return result;
  }
  return null;
}

export default traverseNode