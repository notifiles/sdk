import { fromHtml } from 'hast-util-from-html'
import { toMdast } from 'hast-util-to-mdast'

export default async ({ data } = {}) => {
  const hast = fromHtml(data, { fragment: true })
  const mdast = toMdast(hast)
  return mdast
}


// import fs from 'node:fs/promises'
// import {fromHtml} from 'hast-util-from-html'
// import {toMdast} from 'hast-util-to-mdast'
// import {toMarkdown} from 'mdast-util-to-markdown'

// const html = String(await fs.readFile('example.html'))
// const hast = fromHtml(html, {fragment: true})
// const mdast = toMdast(hast)
// const markdown = toMarkdown(mdast)

// console.log(markdown)
