import htmlToMdast from '../../../../lib/remark/htmlToMdast_.js'
import mdastToMarkdown from '../../../../lib/remark/mdastToMarkdown.js'
import reset from '../reset.js'
import { render } from '@react-email/render'

export default async (props) => {

  const { entry } = props
  const { path, email } = entry
  const { default: Template, } = email
  await reset({ path })

  let html = render(<Template />, {
    pretty: true,
  })

  const text = render(<Template />, {
    plainText: true,
  })

  const child = await htmlToMdast({ data: html })
  const mdast = await perform({
    child,
    path
  })

  let md = await mdastToMarkdown({ mdast })

  // await updatePost({
  //   path,
  //   md,
  //   html
  // })

  return {
    entry: {
      ...entry,
      email: {
        text,
        html,
        mdast,
        md
      }
    },

  }
}

const perform = async (props) => {
  const { child, path } = props
  return child
}
