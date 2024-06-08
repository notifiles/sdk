import hastToHtml from '../../../../lib/remark/hastToHtml.js'
import treatImage from './image/index.js'
import fs from 'fs'

export default async (props) => {
  const { entry, settings } = props
  const { path, email: { hast }, buildPaths } = entry

  const _hast = await perform({
    entry,
    child: hast,
    path,
    settings,
    buildPaths
  })

  let body = hastToHtml({ data: _hast })

  await fs.promises.writeFile(
    buildPaths.email.body,
    body
  )

  return {
    entry: {
      ...entry,
      email: {
        ...entry.email,
        md: null,
        body,
        hast: _hast,
      }
    }
  }
}

const perform = async (props) => {
  const { child, path, buildPaths, settings, entry } = props
  let _child = { ...child }

  if (child.properties && child.properties.dataNotifilesDoNotCloudify) {
    return child
  }

  switch (_child.tagName) {
    case 'img': {
      _child = await treatImage({
        child: _child,
        path,
        settings,
        buildPaths,
        entry
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
