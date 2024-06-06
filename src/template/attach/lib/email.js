import fs from 'fs'
import checkFileExists from '../../../lib/fs/checkFileExists.js'
import fsPath from 'path'

export default async (props) => {
  const { entry, settings } = props
  const {
    path,
    buildPaths,
    code,
  } = entry

  const sharedItemsPath = `${path}/attachments`
  let sharedItems = await fs.promises.readdir(sharedItemsPath)
  let items = (await Promise.all(sharedItems.map(async item => {
    const folderPath = fsPath.join(sharedItemsPath, item)
    const folderPathStat = await fs.promises.stat(folderPath)
    if (!folderPathStat) {
      return null
    }

    const isDir = folderPathStat.isDirectory()
    if (isDir) {
      return null
    }
    return {
      fileName: item,
      path: `${sharedItemsPath}/${item}`
    }
  }))).filter(a => a)

  const codeOwnItemsPath = `${path}/attachments/${entry.code}`

  if ((await checkFileExists(codeOwnItemsPath))) {
    let codeOwnItems = await fs.promises.readdir(codeOwnItemsPath)
    items = [
      ...items,
      ...(codeOwnItems.map(fileName => ({
        fileName,
        path: `${codeOwnItemsPath}/${fileName}`
      })))
    ]
  }

  if (!items) {
    return { entry }
  }

  await Promise.all(items.map(async ({ fileName, path: filePath }) => {
    return fs.promises.cp(
      filePath,
      `${path}/.build/email/${code}/attachments/${fileName}`,
    )
  }))

  return {
    entry
  }
}
