import hastToHtml from '../../../../lib/remark/hastToHtml.js'
import treatAttachments from './attachments/index.js'
import treatImage from './image/index.js'


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

  await treatAttachments({
    path,
    settings,
    buildPaths,
    entry
  })

  // let md = await mdastToMarkdown({ mdast })
  let body = hastToHtml({ data: _hast })
  // await fs.promises.writeFile(`${path}/.build/html/email.cloud.html`, html)


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

  if (child.properties && child.properties.dataMastermailDoNotCloudify) {
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
