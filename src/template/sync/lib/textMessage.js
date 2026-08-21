import fs from 'fs'
import updateActivity from '../../lib/activity/updateToFile.js'
import getActivity from '../../lib/activity/get.js'
import importJSONAsync from '../../../lib/fs/importJSONAsync.js'
import checkFileExists from '../../../lib/fs/checkFileExists.js'
import syncFolder from './syncFolder.js'

export default async (props) => {

  const { entry, settings } = props
  const { path, textMessage, buildPaths, } = entry
  // textMessage is null unless the template folder has a textmessage.txt (set in lib/entries/getAtPath.js).
  // Every template must ship a textmessage.txt (an empty file is fine, see templates/social/subscription/*)
  // or this destructure throws before the existence check below ever runs.
  const { text, } = textMessage

  const textPath = `${path}/textmessage.txt`
  if (!(await checkFileExists(textPath))) {
    return {
      entry
    }
  }

  await fs.promises.writeFile(
    buildPaths.textMessage.text,
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
    buildPaths.textMessage.manifestFileNameBuilt,
    JSON.stringify(manifest, null, 2)
  )

  const { clouds } = settings
  let uploadResult = null
  for (var i in clouds) {
    const cloud = clouds[i]
    uploadResult = await syncFolder({
      id: cloud.id,
      sourceUrl: buildPaths.textMessage.container,
      destinationPath: buildPaths.textMessage.containerRemote,
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
