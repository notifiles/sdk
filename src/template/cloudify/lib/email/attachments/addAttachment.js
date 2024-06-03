import getActivity from '../../../../lib/activity/get.js'
import updateActivity from '../../../../lib/activity/updateToFile.js'

export default async ({ path, entry, fileName, attachment }) => {
  let activity = await getActivity({ path })
  let attachments = [
    ...((activity[entry.code] && activity[entry.code].attachments)
      ? activity[entry.code].attachments
      : []),
  ]

  attachments = attachments.filter(a => a.id !== fileName)
  attachments.push(attachment)

  activity[entry.code] = {
    ...(activity[entry.code] ? activity[entry.code] : {}),
    attachments
  }

  await updateActivity({
    path,
    content: activity,
  })
}
