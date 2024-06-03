import cloudLibrary from './cloudLibrary/index.js'

export default ({ settings }) => {

  if (!settings.defaultLocale) {
    settings.defaultLocale = "en_us"
  }

  if (!settings.cloudLibrary) {
    settings.cloudLibrary = cloudLibrary
  }
}
