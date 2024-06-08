import fsPath from 'path'
import isLocal from 'is-local'
import isRelative from 'is-relative'
import sharp from 'sharp'
import fs from 'fs'

export default async ({ child,
  path, buildPaths }) => {
  const { properties: {
    src: url,
  } } = child

  if (!isLocal(url)) {
    return child
  }

  const sourceUrl = isRelative(url) ? fsPath.resolve(path, url) : url
  const extension = fsPath.parse(sourceUrl).ext
  switch (extension) {
    case '.svg': {
      return child
    }
    default: break
  }

  const filename = `${fsPath.parse(sourceUrl).name}_optimized.webp`
  const destination = `${buildPaths.email.assetsContainer}/${filename}`

  await sharp(sourceUrl)
    .webp({ quality: 90 })
    .toFile(destination)

  await fs.promises.rm(sourceUrl)

  // const newUrl = `assets/${filename}`
  const newUrl = destination
  return {
    ...child,
    properties: {
      ...child.properties,
      src: newUrl
    }
  }
}
