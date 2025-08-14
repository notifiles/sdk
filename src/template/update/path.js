import consolidate from '../consolidate/entry.js'
import getEntries from '../../lib/entries/getAtPath.js'
import build from '../build/entry.js'
import sync from '../sync/entry.js'
import format from '../format/entry.js'
import optimize from '../optimize/entry.js'
import cloudify from '../cloudify/entry.js'
import adaptSettings from '../../lib/adaptSettings.js'
import attach from '../attach/entry.js'

export default async ({
  path,
  settings
}) => {
  adaptSettings({ settings })
  const entries = await getEntries({
    path,
    settings
  })

  await Promise.all(entries.map(async entry => {
    switch (entry.manifest.status) {
      case 'pause': {
        return
      }
      default: break
    }

    entry = (await format({ entry, settings })).entry
    entry = (await build({ entry, settings })).entry
    entry = (await consolidate({ entry, settings })).entry
    entry = (await optimize({ entry, settings })).entry
    entry = (await cloudify({ entry, settings })).entry
    entry = (await attach({ entry, settings })).entry
    if (settings.dryRun) {
      return
    }
    entry = (await sync({ entry, settings })).entry
  }))

  return true
}
