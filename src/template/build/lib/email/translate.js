export default ({ text, strings }) => {
  const replacer = (match, p1) => {
    const str = match.trim().replace('[[', '').replace(']]', '')

    if (!strings[str]) {
      return match
    }

    const prefix = match[0] === " " ? " " : ""
    const suffix = match[match.length - 1] === " " ? " " : ""
    return prefix + strings[str] + suffix
  }

  const reg = new RegExp(/ *\[\[[^)]*\]\] */g)
  return text.replaceAll(reg, replacer)
}
