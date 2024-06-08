import isLocal from 'is-local'
import treatLocalFile from './treatLocalFile.js'
import treatRemoteFile from './treatRemoteFile.js'
import ensureDirectoryExists from '../../../../lib/fs/ensureDirectoryExists.js'

export default async ({ child,
  path, buildPaths }) => {
  const { properties: {
    src: url,
  } } = child

  let result
  const destination = buildPaths.email.assetsContainer
  await ensureDirectoryExists(destination)

  if (isLocal(url)) {
    if (url.indexOf(destination) !== 0) {
      return child
    }

    result = await treatLocalFile({ url, path, destination })
  }
  else {
    result = await treatRemoteFile({ url, destination })
  }

  let filename = result.filename
  // const newUrl = `.assets/${filename}`
  const newUrl = result.path
  return {
    ...child,
    properties: {
      ...child.properties,
      src: newUrl
    }
  }
}

