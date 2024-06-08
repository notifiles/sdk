import fsPath from 'path'
import fs from 'fs'
import isRelative from 'is-relative'

export default async ({
  url, path, destination }) => {
  const sourceUrl = isRelative(url) ? fsPath.resolve(path, url) : url
  const filename = fsPath.basename(sourceUrl)
  const _destination = `${destination}/${filename}`
  await fs.promises.cp(sourceUrl, _destination)
  return {
    filename,
    path: _destination
  }
}
