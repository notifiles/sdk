import checkFileExists from '../fs/checkFileExists.js'
import fs from 'fs'
import fsPath from 'path'
import _ from 'underscore'
import isPathEntry from './isPathEntry.js'
import importJSONAsync from "../fs/importJSONAsync.js"
import slug from 'slug'
import createActivityIfNeeded from '../../template/lib/activity/createFileIfNeeded.js'

const perform = async (props) => {
  const {
    path,
  } = props

  try {
    if (!(await checkFileExists(path))) {
      return null
    }

    const items = await fs.promises.readdir(path)

    if (!items || !items.length) {
      return null
    }

    let results = (await Promise.all(items.map(async item => {

      const folderPath = fsPath.join(path, item)

      const folderPathStat = await fs.promises.stat(folderPath)
      if (!folderPathStat) {
        return null
      }

      const isDir = folderPathStat.isDirectory()
      if (!isDir) {
        return null
      }

      if (!(await isPathEntry({ path: folderPath }))) {
        return perform({
          ...props,
          path: folderPath
        })
      }


      let testMessagePath = fsPath.join(folderPath, 'textmessage.txt')
      let pushPath = fsPath.join(folderPath, 'pushnotification.txt')
      const i18nPath = fsPath.join(folderPath, 'i18n.json')
      let manifest = await importJSONAsync(fsPath.join(folderPath, 'manifest.json'))

      await createActivityIfNeeded({ path: folderPath })


      let activity
      const activityPath = fsPath.join(folderPath, '.activity.json')
      if (await checkFileExists(activityPath)) {
        activity = await importJSONAsync(activityPath)
      }

      // await createActivityIfNeeded({ path: folderPath })

      // const module = await import(emailPath)
      let textMessage = null
      let pushNotification = null
      let i18n = null

      if (await checkFileExists(testMessagePath)) {
        textMessage = await fs.promises.readFile(testMessagePath, 'utf8')
      }

      if (await checkFileExists(pushPath)) {
        pushNotification = await fs.promises.readFile(pushPath, 'utf8')
      }

      if (await checkFileExists(i18nPath)) {
        i18n = await importJSONAsync(i18nPath)
      }


      return [{
        name: item,
        slug: slug(item),
        path: folderPath,
        // email: module,
        textMessage,
        pushNotification,
        i18n: i18n ? i18n : {},
        manifest,
        activity
      }]

    }))).filter(a => a)

    results = _.flatten(results)
    return results
  }
  catch (e) {
    console.error(e)
    return null
  }
}

export default perform
