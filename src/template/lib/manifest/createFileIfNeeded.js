import fsPath from 'path'
import fs from 'fs'
import checkFileExists from '../../../lib/fs/checkFileExists.js'
import importJSONAsync from '../../../lib/fs/importJSONAsync.js'

export default async ({
  path,
  data = {},
}) => {


  try {

    const filePath = fsPath.join(path, "manifest.json")

    if ((await checkFileExists(filePath))) {
      return
    }

    const defaultContent = await importJSONAsync('./defaultContent.json')
    let content = {
      ...defaultContent,
      createdAt: (new Date()),
      ...data,
    }

    await fs.promises.writeFile(filePath, JSON.stringify(content, null, 2))
    return true
  } catch (e) {
    console.error(e)
  }
  return false
}
