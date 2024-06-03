import fsPath from 'path'
import checkFileExists from '../../../lib/fs/checkFileExists.js'
import importJSONAsync from '../../../lib/fs/importJSONAsync.js'

export default async ({
  path,
}) => {
  try {
    const filePath = fsPath.join(path, ".activity.json")

    if (!(await checkFileExists(filePath))) {
      return null
    }

    return importJSONAsync(filePath)
  } catch (e) {
    console.error(e)
  }
  return null
}
