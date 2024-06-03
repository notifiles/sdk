import checkFileExists from '../fs/checkFileExists.js'
import fs from 'fs'
import fsPath from 'path'

export default async (props) => {
  const {
    path,
  } = props

  if (!(await checkFileExists(path))) {
    return false
  }

  const pathStat = await fs.promises.stat(path)
  if (!pathStat) {
    return false
  }

  const isDir = pathStat.isDirectory()
  if (!isDir) {
    return false
  }

  const postPath = fsPath.join(path, 'email.js')
  const postPath2 = fsPath.join(path, 'email.tsx')

  return ((await checkFileExists(postPath))
    || (await checkFileExists(postPath2)))
}
