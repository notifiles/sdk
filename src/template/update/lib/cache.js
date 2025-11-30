import fs from 'fs'
import fsPath from 'path'
import { createHash } from 'crypto'
import checkFileExists from '../../../lib/fs/checkFileExists.js'
import importJSONAsync from '../../../lib/fs/importJSONAsync.js'

const CACHE_DIR_NAME = '.cache'
const CACHE_FILE_NAME = 'template-update.json'
const IGNORED_DIRECTORIES = new Set([CACHE_DIR_NAME, '.build'])
const IGNORED_FILES = new Set(['.DS_Store'])

const sortByName = (a, b) => a.name.localeCompare(b.name)

const digestDirectory = async ({
  rootPath,
  currentPath,
  hash
}) => {
  const entries = await fs.promises.readdir(currentPath, { withFileTypes: true })
  entries.sort(sortByName)

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRECTORIES.has(entry.name)) {
        continue
      }
      await digestDirectory({
        rootPath,
        currentPath: fsPath.join(currentPath, entry.name),
        hash
      })
      continue
    }

    if (!entry.isFile() || IGNORED_FILES.has(entry.name)) {
      continue
    }

    const filePath = fsPath.join(currentPath, entry.name)
    const relativePath = fsPath.relative(rootPath, filePath)
    const content = await fs.promises.readFile(filePath)
    hash.update(relativePath)
    hash.update(content)
  }
}

export const computeTemplateHash = async ({
  path
}) => {
  try {
    if (!(await checkFileExists(path))) {
      return null
    }

    const hash = createHash('sha256')
    await digestDirectory({
      rootPath: path,
      currentPath: path,
      hash,
    })
    return hash.digest('hex')
  } catch (e) {
    console.error(e)
  }
  return null
}

export const getCachedTemplateHash = async ({
  path
}) => {
  try {
    const cachePath = fsPath.join(path, CACHE_DIR_NAME, CACHE_FILE_NAME)
    if (!(await checkFileExists(cachePath))) {
      return null
    }

    const cacheContent = await importJSONAsync(cachePath)
    if (!cacheContent || !cacheContent.hash) {
      return null
    }

    return cacheContent.hash
  } catch (e) {
    console.error(e)
  }
  return null
}

export const updateTemplateHashCache = async ({
  path,
  hash,
}) => {
  try {
    const cacheDir = fsPath.join(path, CACHE_DIR_NAME)
    await fs.promises.mkdir(cacheDir, { recursive: true })

    const cachePath = fsPath.join(cacheDir, CACHE_FILE_NAME)
    const payload = {
      hash,
      updatedAt: (new Date()).toISOString(),
    }
    await fs.promises.writeFile(cachePath, JSON.stringify(payload, null, 2))
    return true
  } catch (e) {
    console.error(e)
  }
  return false
}
