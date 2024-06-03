import fsPath from 'path'
import downloadImage from 'image-downloader'

export default async ({ url,
  destination
}) => {
  try {
    const options = {
      url,
      dest: destination,         // will be saved to /path/to/dest/photo
      extractFilename: true,
    }

    const item = await downloadImage.image(options)
    // const { filename } = item
    const filename = fsPath.basename(item.filename)

    return {
      filename
    }
  }
  catch (e) {
    console.error(e)
  }
}
