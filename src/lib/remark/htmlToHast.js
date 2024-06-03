import { fromHtml, } from 'hast-util-from-html'

export default ({ data } = {}) => {
  const hast = fromHtml(data, { fragment: true })
  return hast
}
