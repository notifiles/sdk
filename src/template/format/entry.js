
export default async ({
  entry,
  settings = {},
}) => {
  const { email, path, i18n = {} } = entry
  let _i18n = i18n
  if (!_i18n[settings.defaultLocale]) {
    _i18n[settings.defaultLocale] = {}
  }

  const keys = Object.keys(_i18n)
  const versions = keys.map(language => {
    const code = language
    return {
      ...entry,
      language: {
        code,
        data: _i18n[language]
      },
      code,
      buildPaths: {
        email: {
          container: `${path}/.build/email/${code}`,
          body: `${path}/.build/email/${code}/body.html`,
          bodyFileName: `${entry.slug}/email/${code}/body.html`,
          text: `${path}/.build/email/${code}/text.txt`,
          textFileName: `${entry.slug}/email/${code}/text.txt`,
          subject: `${path}/.build/email/${code}/subject.txt`,
          subjectFileName: `${entry.slug}/email/${code}/subject.txt`,
          assetsContainer: `${entry.slug}/email/${code}/assets`,
          attachmentsContainer: `${entry.slug}/email/${code}/attachments`,
          manifestFileNameBuilt: `${path}/.build/email/${code}/manifest.json`,
          manifestFileName: `${entry.slug}/email/${code}/manifest.json`,
        },
        textMessage: {
          container: `${path}/.build/textmessage/${code}`,
          text: `${path}/.build/textmessage/${code}/textmessage.txt`,
          textFileName: `${entry.slug}/textmessage/${code}/textmessage.txt`,
          assetsContainer: `${entry.slug}/textmessage/${code}/assets`,
          manifestFileNameBuilt: `${path}/.build/textmessage/${code}/manifest.json`,
          manifestFileName: `${entry.slug}/textmessage/${code}/manifest.json`,
        },
        pushNotification: {
          container: `${path}/.build/pushnotification/${code}`,
          text: `${path}/.build/pushnotification/${code}/pushnotification.txt`,
          textFileName: `${entry.slug}/pushnotification/${code}/pushnotification.txt`,
          assetsContainer: `${entry.slug}/pushnotification/${code}/assets`,
          manifestFileNameBuilt: `${path}/.build/pushnotification/${code}/manifest.json`,
          manifestFileName: `${entry.slug}/pushnotification/${code}/manifest.json`,
        },
        manifestFileNameBuilt: `${path}/.build/manifest.json`,
        manifestFileName: `${entry.slug}/manifest.json`,
        activityPath: `${path}/.activity.json`,
      }
    }
  })

  return {
    entry: {
      ...entry,
      versions
    }
  }
}
