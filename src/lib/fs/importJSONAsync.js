import fs from "fs"
import checkFileExists from "./checkFileExists.js"

const expandEnvPlaceholders = (value) => {
  if (typeof value === 'string') {
    return value.replace(/\$\{process\.env\.([A-Z0-9_]+)\}/g, (match, envKey) => {
      const envValue = process.env[envKey]
      return envValue !== undefined ? envValue : match
    })
  }

  if (Array.isArray(value)) {
    return value.map(expandEnvPlaceholders)
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, val]) => {
      acc[key] = expandEnvPlaceholders(val)
      return acc
    }, {})
  }

  return value
}

export default async _url => {
  // try {
  if (!(await checkFileExists(_url))) {
    return null
  }
  const fileUrl = new URL(_url, import.meta.url)
  const parsedPackageJSON = JSON.parse(await fs.promises.readFile(fileUrl, 'utf8'))
  return expandEnvPlaceholders(parsedPackageJSON)
  // } catch (e) {
  //   console.log("[notifiles]", `importJSONAsync → `, e)
  //   return null
  // }
}
