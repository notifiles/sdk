import isLocal from 'is-local'
import upload from '../../upload.js'
import treatRemoteFile from './treatRemoteFile.js'
import treatLocalFile from './treatLocalFile.js'

import getActivity from '../../../../lib/activity/get.js'
import updateActivity from '../../../../lib/activity/updateToFile.js'

export default async ({ child,
  path,
  settings,
  buildPaths,
  entry
}) => {
  const { properties: {
    src: _url,
  } } = child

  //#region CACHE
  let _activity = await getActivity({ path })
  // if (!settings.forceUploadAssets) {
  //   const codeActivity = _activity[entry.code]
  //   if (codeActivity) {
  //     const files = codeActivity.files
  //     if (files && files[_url]) {
  //       const cache = files[_url]
  //       return {
  //         ...child,
  //         properties: {
  //           ...child.properties,
  //           src: cache.url
  //         }
  //       }
  //     }
  //   }
  // }
  //#endregion

  let result
  const destination = buildPaths.email.assetsContainer
  if (isLocal(_url)) {
    result = await treatLocalFile({ url: _url, path, destination })
  }
  else {
    result = await treatRemoteFile({ url: _url, destination })
  }
  let { sourceUrl, filename } = result


  const { clouds } = settings
  let uploadResult = null
  for (var i in clouds) {
    const cloud = clouds[i]
    uploadResult = await upload({
      id: cloud.id,
      sourceUrl,
      filename: `${buildPaths.email.assetsContainerRemote}/${filename}`,
      auth: cloud.auth,
      settings
    })
  }

  if (!uploadResult || !uploadResult.url) {
    return child
  }

  _activity = await getActivity({ path })
  _activity[entry.code] = {
    ...(_activity[entry.code] ? _activity[entry.code] : {}),
    files: {
      ...((_activity[entry.code] && _activity[entry.code].files) ? _activity[entry.code].files : {}),
      [_url]: {
        url: uploadResult.url
      }
    }
  }

  await updateActivity({
    path,
    content: _activity,
  })


  return {
    ...child,
    properties: {
      ...child.properties,
      src: uploadResult.url
    }
  }
}
