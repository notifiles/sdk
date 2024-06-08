import hastToHtml from '../../../lib/remark/hastToHtml.js';
import treatImage from './image/index.js';
import ensureDirectoryExists from '../../../lib/fs/ensureDirectoryExists.js';
import fs from 'fs';

export default async (props) => {
  const { entry } = props
  const { path, email: { hast }, buildPaths } = entry


  const _hast = await perform({
    child: hast,
    path,
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
        hast: _hast,
        body
      }
    }
  }
}

const perform = async (props) => {
  const { child, path, buildPaths } = props
  let _child = { ...child }

  if (child.properties && child.properties.dataNotifilesDoNotConsolidate) {
    return child
  }

  switch (_child.tagName) {
    case 'img': {
      _child = await treatImage({
        child: _child,
        path,
        buildPaths
      })
    } break
    default:
      break
  }

  let _children = []
  if (_child.children) {
    _children = await Promise.all(_child.children.map(async __child => perform({
      ...props,
      child: __child
    })))
  }

  return {
    ..._child,
    children: _children
  }
}
