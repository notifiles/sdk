import fs from 'fs'

export default async (filePath, stripFileName = true) => {
  try {
    await fs.promises.mkdir(filePath)
    return true
  } catch (e) {
    return false
  }
}
