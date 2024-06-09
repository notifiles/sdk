export default async ({
  filename,
  auth,
  // contentType = 'image/png'
}) => {

  try {
    const {
      accessKey,
      storageZoneName,
      pullZone
    } = auth

    const url = `https://${pullZone}.b-cdn.net/${filename}`
    return url

  } catch (e) {
    console.error(e)
  }
  return null
}
