import upload from './upload.js'
import fs from 'fs'
import updateActivity from '../../lib/activity/updateToFile.js'
import getActivity from '../../lib/activity/get.js'
import importJSONAsync from '../../../lib/fs/importJSONAsync.js'
import checkFileExists from '../../../lib/fs/checkFileExists.js'

export default async (props) => {

  const { entry, settings } = props
  const { path, pushNotification, buildPaths, } = entry
  const { text, } = pushNotification

  const textPath = `${path}/pushnotification.txt`
  if (!(await checkFileExists(textPath))) {
    return {
      entry
    }
  }

  await fs.promises.writeFile(
    buildPaths.pushNotification.text,
    text
  )

  let manifest = await importJSONAsync(
    buildPaths.manifestFileNameBuilt,
  )

  let activity = await importJSONAsync(
    buildPaths.activityPath,
  )

  manifest =
  {
    ...manifest,
    ...activity[entry.code]
  }

  await fs.promises.writeFile(
    buildPaths.pushNotification.manifestFileNameBuilt,
    JSON.stringify(manifest, null, 2)
  )

  const { clouds } = settings
  let uploadResult = null
  for (var i in clouds) {
    const cloud = clouds[i]
    uploadResult = await upload({
      id: cloud.id,
      sourceUrl: buildPaths.pushNotification.text,
      filename: buildPaths.pushNotification.textFileName,
      auth: cloud.auth,
      settings
    })
    uploadResult = await upload({
      id: cloud.id,
      sourceUrl: buildPaths.pushNotification.manifestFileNameBuilt,
      filename: buildPaths.pushNotification.manifestFileName,
      auth: cloud.auth,
      settings
    })
  }

  const _activity = await getActivity({ path })

  _activity[entry.code] = {
    ...(_activity[entry.code] ? _activity[entry.code] : {}),
    status: "published"
  }

  await updateActivity({
    path,
    content: _activity,
  })

  return {
    entry
  }
}
