import * as Minio from 'minio'
import { walk } from 'walk'

export default async ({
  sourceUrl,
  destinationPath,
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

    const walker = walk(sourceUrl)
    const result = await new Promise((resolve, reject) => {
      walker.on('file', (root, fileStats, next) => {
        const filePath = `${root}/${fileStats.name}`
        const postSourceURl = root.split(sourceUrl)[1]
        let destination = `${destinationPath}/${postSourceURl}/${fileStats.name}`
        destination = destination.replaceAll('//', '/')
        console.log('Upload', filePath)

        minioClient.fPutObject(
          bucketName,
          destination,
          filePath,
          err => {
            console.log(filePath, 'uploaded')
            if (err) {
              console.error(err)
              reject(err)
            }
            next()
          })
      })

      walker.on('end', function () {
        console.log('End upload')
        resolve()
      })
    })

    return {}
  } catch (e) {
    console.error(e)
  }
  return null
}
