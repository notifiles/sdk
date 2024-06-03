import { toHtml } from 'hast-util-to-html'

export default ({ data } = {}) => {
  const html = toHtml(data)
  return html
}
