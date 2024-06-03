import * as Minio from 'minio'

export default async ({
  sourceUrl,
  filename,
  auth,
  // contentType = 'image/png'
}) => {

  try {
    const {
      endPoint,
      accessKey,
      secretKey,
      bucketName
    } = auth

    const minioClient = new Minio.Client({
      endPoint,
      // port,
      // useSSL,
      accessKey,
      secretKey,
    })

    const exists = await minioClient.bucketExists(bucketName)
    if (!exists) {
      return null
      // await minioClient.makeBucket(bucketName, 'us-east-1')
      // console.log('Bucket ' + bucketName + ' created in "us-east-1".')
    }

    const metaData = {
      // 'Content-Type': contentType,
    }

    const minioResult = await new Promise((resolve, reject) => {
      minioClient.removeObject(
        bucketName,
        filename,
        {},
        (error, objInfo) => {
          if (error) {
            reject(error)
            return
          }

          resolve(objInfo)
        })
    })

    return { success: true }

  } catch (e) {
    console.error(e)
  }
  return null
}
