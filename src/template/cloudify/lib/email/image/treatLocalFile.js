import fsPath from 'path'
import isRelative from 'is-relative'

export default async ({
  url, path, }) => {
  const sourceUrl = isRelative(url) ? fsPath.resolve(path, url) : url
  const filename = fsPath.basename(sourceUrl)

  return {
    filename,
    sourceUrl
  }
}
