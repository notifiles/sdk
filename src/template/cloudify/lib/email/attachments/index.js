import upload from '../../upload.js'

import getActivity from '../../../../lib/activity/get.js'
import updateActivity from '../../../../lib/activity/updateToFile.js'
import fs from 'fs'
import checkFileExists from '../../../../../lib/fs/checkFileExists.js'
import _mimetype from 'mimetype'
import remove from '../../remove.js'
import addAttachment from './addAttachment.js'

export default async ({ child,
  path,
  settings,
  buildPaths,
  entry
}) => {

  let entries = await fs.promises.readdir(`${path}/attachments`)
  let items = entries.map(fileName => ({
    fileName,
    path: `${path}/attachments/${fileName}`
  }))

  let codeDestination = `${path}/attachments/${entry.code}`
  if ((await checkFileExists(codeDestination))) {
    entries = await fs.promises.readdir(codeDestination)
    items = [
      ...items,
      ...(entries.map(fileName => ({
        fileName,
        path: `${codeDestination}/${fileName}`
      })))
    ]
  }

  if (!items) {
    return {}
  }

  const { clouds } = settings

  let __activity = await getActivity({ path })
  let previousActivity = __activity[entry.code]
  __activity[entry.code] = {}
  await updateActivity({
    path,
    content: __activity,
  })

  const uploaded = []
  for (var i in items) {
    const { fileName, path: folderPath } = items[i]
    const fileNameRemote = encodeURI(fileName)

    const folderPathStat = await fs.promises.stat(folderPath)
    if (!folderPathStat) {
      continue
    }

    const isDir = folderPathStat.isDirectory()
    if (isDir) {
      continue
    }

    if (!settings.forceUploadAttachments) {
      if (previousActivity) {
        if (previousActivity.attachments) {
          const attachment = previousActivity.attachments.find(a => a.id === fileName)
          if (attachment) {
            uploaded.push(attachment)
            await addAttachment({ path, entry, fileName, attachment })
            continue
          }
        }
      }
    }

    const mimeType = _mimetype.lookup(folderPath)
    let uploadResult = null

    for (var i in clouds) {
      const cloud = clouds[i]
      uploadResult = await upload({
        id: cloud.id,
        sourceUrl: folderPath,
        filename: `${buildPaths.email.attachmentsContainer}/${fileNameRemote}`,
        auth: cloud.auth,
        settings
      })
    }

    if (!uploadResult || !uploadResult.url) {
      continue
    }

    const attachment = {
      id: fileName,
      fileName,
      url: uploadResult.url,
      mimeType,
      disposition: "attachment",
      relativeFileName: `${buildPaths.email.attachmentsContainer}/${fileNameRemote}`,
    }
    uploaded.push(attachment
    )
    await addAttachment({
      path, entry, fileName, attachment
    })
  }


  const removed = []
  for (var i in previousActivity.attachments) {
    const item = previousActivity.attachments[i]
    const eq = uploaded.find(a => a.id === item.id)
    if (!eq) {
      removed.push(item)
    }
  }

  for (var i in removed) {
    const item = removed[i]
    for (var i in clouds) {
      const cloud = clouds[i]
      await remove({
        id: cloud.id,
        filename: item.relativeFileName,
        auth: cloud.auth,
        settings
      })
    }
  }
  return {

  }
}

