import {parseSource} from 'cherow'

function isReactCreateElementCall(node) {
  if (node.type === 'CallExpression') {
    const {callee} = node

    switch (callee.type) {
      case 'Identifier':
        return callee.name === 'createElement'
      case 'MemberExpression':
        return callee.property.name === 'createElement'
      default:
        return false
    }
  }

  return false
}

// breadth-first
function traverse(node, callback) {
  if (!node) return

  const queue = [node]
  while (queue.length !== 0) {
    const current = queue.pop()
    const shouldReturn = callback(current)
    if (shouldReturn) return true

    if (typeof current === 'object') {
      for (let i in current) {
        queue.unshift(current[i])
      }
    }
  }

  return false
}

const memo = new Map()

export default function isReactComponent(
  inQuestion,
  predicate = isReactCreateElementCall,
) {
  if (typeof inQuestion === 'function') {
    if (inQuestion.prototype.isReactComponent) return true

    const cached = memo.get(inQuestion)
    if (cached) return cached

    const contents = inQuestion.toString()
    const [ast] = parseSource(contents).body
    const result = traverse(ast, predicate)

    memo.set(inQuestion, result)
    return result
  }

  return false
}
