import fs from 'fs'
import updateActivity from '../../lib/activity/updateToFile.js'
import getActivity from '../../lib/activity/get.js'
import importJSONAsync from '../../../lib/fs/importJSONAsync.js'
import checkFileExists from '../../../lib/fs/checkFileExists.js'
import syncFolder from './syncFolder.js'

export default async (props) => {

  const { entry, settings } = props
  const { path, pushNotification, buildPaths, } = entry

  // pushNotification is null unless the template folder has a pushnotification.txt
  // (set in lib/entries/getAtPath.js, populated in build/lib/pushnotification/index.js).
  // The existence check must run before destructuring it, or a template
  // that simply doesn't ship this channel crashes here instead of skipping.
  const textPath = `${path}/pushnotification.txt`
  if (!(await checkFileExists(textPath))) {
    return {
      entry
    }
  }

  const { text, } = pushNotification

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
    uploadResult = await syncFolder({
      id: cloud.id,
      sourceUrl: buildPaths.pushNotification.container,
      destinationPath: buildPaths.pushNotification.containerRemote,
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
