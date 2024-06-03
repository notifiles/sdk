import isLocal from 'is-local'
import treatLocalFile from './treatLocalFile.js'
import treatRemoteFile from './treatRemoteFile.js'

export default async ({ child,
  path, entry }) => {
  const { properties: {
    src: url,
  } } = child

  let result
  const destination = `${path}/.assets`

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
  const newUrl = `.assets/${filename}`
  return {
    ...child,
    properties: {
      ...child.properties,
      src: newUrl
    }
  }
}

