import consolidate from '../consolidate/entry.js'
import getEntries from '../../lib/entries/getAtPath.js'
import build from '../build/entry.js'
import sync from '../sync/entry.js'
import format from '../format/entry.js'
import optimize from '../optimize/entry.js'
import cloudify from '../cloudify/entry.js'
import adaptSettings from '../../lib/adaptSettings.js'
import attach from '../attach/entry.js'
import {
  computeTemplateHash,
  getCachedTemplateHash,
  updateTemplateHashCache
} from './lib/cache.js'

export default async ({
  path,
  settings = {},
  force = false
}) => {
  adaptSettings({ settings })
  let entries = await getEntries({
    path,
    settings
  })
  if (!entries || !entries.length) {
    return true
  }

  const forceUpdate = force || settings.forceUpdate

  for (var i in entries) {
    let entry = entries[i]

    switch (entry.manifest.status) {
      case 'pause': {
        continue
      }
      default: break
    }

    const cachedHash = await getCachedTemplateHash({ path: entry.path })
    const currentHash = await computeTemplateHash({ path: entry.path })
    if (!forceUpdate && cachedHash && currentHash && cachedHash === currentHash) {
      console.log(`[notifiles] Skip ${entry.slug || entry.name || entry.path}: no changes detected`)
      continue
    }

    entry = (await format({ entry, settings })).entry
    entry = (await build({ entry, settings })).entry
    entry = (await consolidate({ entry, settings })).entry
    entry = (await optimize({ entry, settings })).entry
    entry = (await cloudify({ entry, settings })).entry
    entry = (await attach({ entry, settings })).entry
    if (settings.dryRun) {
      continue
    }
    entry = (await sync({ entry, settings })).entry

    const newHash = await computeTemplateHash({ path: entry.path })
    if (newHash) {
      await updateTemplateHashCache({ path: entry.path, hash: newHash })
    }
  }

  return true
}
