import syncFolder from './syncFolder.js'
import fs from 'fs'
import updateActivity from '../../lib/activity/updateToFile.js'
import getActivity from '../../lib/activity/get.js'
import importJSONAsync from '../../../lib/fs/importJSONAsync.js'

export default async (props) => {

  const { entry, settings } = props
  const { path, email, buildPaths, } = entry
  const { body, } = email

  // await fs.promises.writeFile(
  //   buildPaths.email.body,
  //   body
  // )

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
    buildPaths.email.manifestFileNameBuilt,
    JSON.stringify(manifest, null, 2)
  )

  const { clouds } = settings
  let uploadResult = null
  for (var i in clouds) {
    const cloud = clouds[i]
    uploadResult = await syncFolder({
      id: cloud.id,
      sourceUrl: buildPaths.email.container,
      destinationPath: buildPaths.email.containerRemote,
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
