import adaptSettings from '../../lib/adaptSettings.js'
import performEmail from './lib/email.js'
import performTextMessage from './lib/textMessage.js'
import performPushNotification from './lib/pushNotification.js'

export default async ({
  entry,
  settings,
}) => {
  adaptSettings({ settings })
  return {
    entry: {
      ...entry,
      versions: await Promise.all(entry.versions.map(async _entry => {
        let res = await performEmail({ entry: _entry, settings, })
        res = await performTextMessage({ entry: res.entry, settings, })
        res = await performPushNotification({ entry: res.entry, settings, })
        return res.entry
      }))
    }
  }
}
