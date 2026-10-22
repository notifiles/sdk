import fs from 'fs'
import os from 'os'
import fsPath from 'path'
import { buildLocalesIndex, LOCALES_INDEX_FILE_NAME } from './build.js'

/**
 * Builds the locales index of `entries` and uploads it as `locales.json` at the root of every cloud in
 * `settings.clouds`. Answers `{ index, uploads: [{ id, url }] }`; a cloud that refuses the upload is reported with a
 * null url and never fails the update (the templates themselves are already synced).
 */
export const publishLocalesIndex = async ({ entries, settings, now = new Date() }) => {
  const index = buildLocalesIndex({ entries, settings, now })
  const folder = await fs.promises.mkdtemp(fsPath.join(os.tmpdir(), 'notifiles-locales-'))
  const sourceUrl = fsPath.join(folder, LOCALES_INDEX_FILE_NAME)
  await fs.promises.writeFile(sourceUrl, JSON.stringify(index, null, 2))

  const uploads = []
  try {
    for (const cloud of settings.clouds || []) {
      const cloudLibrary = settings.cloudLibrary?.({ id: cloud.id })
      if (!cloudLibrary?.upload) {
        uploads.push({ id: cloud.id, url: null })
        continue
      }
      const result = await cloudLibrary.upload({
        sourceUrl,
        filename: LOCALES_INDEX_FILE_NAME,
        auth: cloud.auth,
        contentType: 'application/json',
      })
      uploads.push({ id: cloud.id, url: result?.url || null })
    }
  } finally {
    await fs.promises.rm(folder, { recursive: true, force: true })
  }
  for (const upload of uploads) {
    console.log(upload.url
      ? `[notifiles] Locales index published: ${upload.url}`
      : `[notifiles] Locales index not published to ${upload.id}`)
  }
  return { index, uploads }
}

export default publishLocalesIndex
