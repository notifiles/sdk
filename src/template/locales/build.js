// The locales index of an app's templates (`locales.json`, published at the root of each cloud by every update):
// which locales each template exists in, the app's default locale, and each language's default locale. A sender
// reads it to pick the best locale a template has for a reader (en-gb -> en-us) instead of probing for files.
//
// A template's locales are what its version step builds: the keys of its i18n.json plus the default locale
// (template/format/entry.js). Every template is listed, the ones an update skipped as unchanged included, so the
// index always describes the whole app.
//
// Each language's default comes from the app (`settings.languageDefaults`, e.g. `{ en: 'en-us', pt: 'pt-br' }`).
// Without one for a language, it is the app's default locale when that is of the language, else the language's only
// locale; a language with several locales and no default named is left out, for the sender to choose.

export const LOCALES_INDEX_FILE_NAME = 'locales.json'
export const LOCALES_INDEX_VERSION = 1

export const normalizedLocaleOf = (locale) =>
  locale ? String(locale).trim().toLowerCase().replace(/_/g, '-') : null

const languageOf = (locale) => normalizedLocaleOf(locale)?.split('-')[0] || null

/** The locales one template is built in, normalised, sorted. */
export const localesOfTheEntry = ({ entry, defaultLocale }) => {
  const locales = [...Object.keys(entry?.i18n || {}), defaultLocale]
    .map(normalizedLocaleOf)
    .filter(Boolean)
  return [...new Set(locales)].sort()
}

const languageDefaultsOf = ({ allLocales, defaultLocale, languageDefaults = {} }) => {
  const named = Object.fromEntries(
    Object.entries(languageDefaults || {})
      .map(([language, locale]) => [String(language).toLowerCase(), normalizedLocaleOf(locale)])
      .filter(([, locale]) => Boolean(locale))
  )
  const byLanguage = {}
  for (const locale of allLocales) {
    const language = languageOf(locale)
    byLanguage[language] = [...(byLanguage[language] || []), locale]
  }
  const derived = {}
  for (const [language, locales] of Object.entries(byLanguage)) {
    if (named[language]) {
      continue
    }
    if (languageOf(defaultLocale) === language) {
      derived[language] = defaultLocale
    } else if (locales.length === 1) {
      derived[language] = locales[0]
    }
  }
  return Object.fromEntries(Object.entries({ ...derived, ...named }).sort(([a], [b]) => a.localeCompare(b)))
}

/** The index for `entries` (as getEntries reads them) and the app's settings. */
export const buildLocalesIndex = ({ entries = [], settings = {}, now = new Date() }) => {
  const defaultLocale = normalizedLocaleOf(settings.defaultLocale) || 'en-us'
  const templates = {}
  for (const entry of entries) {
    if (!entry?.slug) {
      continue
    }
    templates[String(entry.slug).toLowerCase()] = localesOfTheEntry({ entry, defaultLocale })
  }
  const allLocales = [...new Set(Object.values(templates).flat())].sort()
  return {
    version: LOCALES_INDEX_VERSION,
    generatedAt: now.toISOString(),
    defaultLocale,
    languageDefaults: languageDefaultsOf({ allLocales, defaultLocale, languageDefaults: settings.languageDefaults }),
    locales: allLocales,
    templates: Object.fromEntries(Object.entries(templates).sort(([a], [b]) => a.localeCompare(b))),
  }
}

export default buildLocalesIndex
