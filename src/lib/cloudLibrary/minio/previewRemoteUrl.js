export default async ({
  filename,
  auth,
  // contentType = 'image/png'
}) => {

  try {
    const {
      endPoint,
      bucketName
    } = auth

    const url = `https://${endPoint}/${bucketName}/${filename}`
    return { url }

  } catch (e) {
    console.error(e)
  }
  return null
}
