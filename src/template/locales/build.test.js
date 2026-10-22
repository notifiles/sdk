import { buildLocalesIndex, localesOfTheEntry } from './build.js'

const now = new Date('2026-10-22T08:00:00.000Z')

const entries = [
  { slug: 'automationemail', i18n: { 'en-us': {}, 'fr-fr': {}, 'es-es': {} } },
  { slug: 'Welcome', i18n: { 'fr_FR': {}, 'pt-br': {}, 'pt-pt': {} } },
  { slug: 'bare', i18n: {} },
]

describe('buildLocalesIndex', () => {
  it('lists every template with the locales it is built in, the default locale included', () => {
    const index = buildLocalesIndex({ entries, settings: { defaultLocale: 'en-us' }, now })
    expect(index.templates).toEqual({
      automationemail: ['en-us', 'es-es', 'fr-fr'],
      bare: ['en-us'],
      welcome: ['en-us', 'fr-fr', 'pt-br', 'pt-pt'],
    })
    expect(index.defaultLocale).toBe('en-us')
    expect(index.version).toBe(1)
    expect(index.generatedAt).toBe('2026-10-22T08:00:00.000Z')
  })

  it('names a default per language: the app default for its language, a lone locale for the others', () => {
    const index = buildLocalesIndex({ entries, settings: { defaultLocale: 'en-us' }, now })
    expect(index.languageDefaults).toEqual({ en: 'en-us', es: 'es-es', fr: 'fr-fr' })
  })

  it('takes the app\'s named defaults over the derived ones, for ambiguous languages too', () => {
    const index = buildLocalesIndex({
      entries,
      settings: { defaultLocale: 'en_US', languageDefaults: { pt: 'pt_BR', fr: 'fr-fr' } },
      now,
    })
    expect(index.languageDefaults).toEqual({ en: 'en-us', es: 'es-es', fr: 'fr-fr', pt: 'pt-br' })
    expect(index.locales).toEqual(['en-us', 'es-es', 'fr-fr', 'pt-br', 'pt-pt'])
  })

  it('normalises locales', () => {
    expect(localesOfTheEntry({ entry: { i18n: { 'EN_gb': {} } }, defaultLocale: 'en-us' })).toEqual(['en-gb', 'en-us'])
  })
})
