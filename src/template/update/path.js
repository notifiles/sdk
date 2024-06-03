import consolidate from '../consolidate/entry.js'
import getEntries from '../../lib/entries/getAtPath.js'
import build from '../build/entry.js'
import sync from '../sync/entry.js'
import format from '../format/entry.js'
import optimize from '../optimize/entry.js'
import version from '../version/entry.js'
import cloudify from '../cloudify/entry.js'
import adaptSettings from '../../lib/adaptSettings.js'

export default async ({
  path,
  settings
}) => {
  adaptSettings({ settings })
  let entries = await getEntries({
    path,
    settings
  })

  for (var i in entries) {
    let entry = entries[i]
    switch (entry.manifest.status) {
      case 'pause': {
        continue
      }
      default: break
    }

    entry = (await format({ entry, settings })).entry
    entry = (await build({ entry, settings })).entry
    entry = (await consolidate({ entry, settings })).entry
    entry = (await optimize({ entry, settings })).entry
    entry = (await cloudify({ entry, settings })).entry
    entry = (await sync({ entry, settings })).entry

    await version({})
  }

  return true
}
