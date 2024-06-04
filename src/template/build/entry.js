import checkFileExists from '../../lib/fs/checkFileExists.js'
import performEmail from './lib/email/index.js'
import performTextMessage from './lib/textmessage/index.js'
import performPushNotification from './lib/pushnotification/index.js'
import fs from 'fs'

export default async ({
  entry,
  settings,
}) => {
  const buildPath = `${entry.path}/.build`
  if ((await checkFileExists(buildPath))) {
    await fs.promises.rmdir(
      buildPath,
      { recursive: true }
    )
  }

  const versions = await Promise.all(entry.versions.map(async _entry => {
    let res = await performEmail({ entry: _entry, settings, })
    res = await performTextMessage({ entry: res.entry, settings, })
    res = await performPushNotification({ entry: res.entry, settings, })
    return res.entry
  }))

  if ((await checkFileExists(`${entry.path}/.build/temp`))) {
    await fs.promises.rmdir(
      `${entry.path}/.build/temp`,
      { recursive: true }
    )
  }

  return {
    entry: {
      ...entry,
      versions
    }
  }
}
