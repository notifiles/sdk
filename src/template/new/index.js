import fsPath from 'path'
import fs from 'fs'
import checkFileExists from '../../lib/fs/checkFileExists.js'
import createActivityIfNeeded from '../lib/activity/createFileIfNeeded.js'
import createManifestIfNeeded from '../lib/manifest/createFileIfNeeded.js'
import createi18nIfNeeded from '../lib/i18n/createFileIfNeeded.js'
import emailTemplate from './templates/email.tsx.js'
import emailTemplateMaster from './templates/email.mastered.js'
import textmessageTemplate from './templates/textmessage.js'
import pushnotificationTemplate from './templates/pushnotification.js'
import _slug from 'slug'

export default async ({
  path,
  title = "My new template",
  tags,
  i18n = {},
  force = false,
  emailType = 'mastered'
}) => {
  try {
    const slug = _slug(title)
    const folderPath = fsPath.join(path, slug)

    if ((await checkFileExists(folderPath))) {
      if (!force) {
        return false
      }
      await fs.promises.rmdir(folderPath, { recursive: true })
    }

    await fs.promises.mkdir(folderPath)
    await fs.promises.mkdir(`${folderPath}/attachments`)
    await fs.promises.mkdir(`${folderPath}/.cache`)

    await createActivityIfNeeded({
      path: folderPath
    })

    await createManifestIfNeeded({
      path: folderPath,
      data: {
        id: slug,
        name: title,
        tags
      }
    })

    await createi18nIfNeeded({
      path: folderPath,
      data: i18n
    })

    const emailPath = fsPath.join(folderPath, "email.tsx")
    const email = (emailType === 'mastered') ? await emailTemplateMaster({}) : await emailTemplate({})
    await fs.promises.writeFile(emailPath, email, 'utf8')
    await fs.promises.writeFile(fsPath.join(folderPath, "email.subject.txt"), "", 'utf8')

    const textMessagePath = fsPath.join(folderPath, "textMessage.txt")
    const textMessage = await textmessageTemplate({})
    await fs.promises.writeFile(textMessagePath, textMessage, 'utf8')

    const pushNotificationPath = fsPath.join(folderPath, "pushnotification.txt")
    const pushNotification = await pushnotificationTemplate({})
    await fs.promises.writeFile(pushNotificationPath, pushNotification, 'utf8')

    return true
  } catch (e) {
    console.error(e)
  }

  return false
}
