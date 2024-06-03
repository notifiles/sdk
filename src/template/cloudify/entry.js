import adaptSettings from '../../lib/adaptSettings.js'
import performEmail from './lib/email/index.js'
import performTextMessage from './lib/textMessage.js'

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
        return res.entry
      }))
    }
  }
}
