import hastToHtml from '../../../lib/remark/hastToHtml.js'
import treatImage from './image/index.js'

export default async (props) => {
  const { entry } = props
  const { path, email: { hast } } = entry

  let _hast = await perform({
    child: hast,
    path
  })

  let body = hastToHtml({ data: _hast })

  return {
    entry: {
      ...entry,
      email: {
        ...entry.email,
        hast: _hast,
        body
      }
    }
  }
}

const perform = async (props) => {
  const { child, path } = props
  let _child = { ...child }

  if (child.properties && _child.properties.dataMastermailDoNotOptimize) {
    return child
  }

  switch (_child.tagName) {
    case 'img': {
      _child = await treatImage({
        child: _child,
        path
      })
    } break
    default:
      break
  }

  let _children = []
  if (_child.children) {
    _children = await Promise.all(_child.children.map(async child => perform({
      ...props,
      child
    })))
  }

  return {
    ..._child,
    children: _children
  }
}
