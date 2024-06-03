import performEmail from './lib/email.js'
import performTextMessage from './lib/textMessage.js'

export default async ({
  entry,
  settings,
}) => {
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
