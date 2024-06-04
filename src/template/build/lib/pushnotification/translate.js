export default ({ text, strings }) => {
  let _text = text

  const firsts = _text.split('[[')
  let matched = firsts.map(element => {
    if (element.indexOf(']]') === -1) {
      return element
    }

    let seconds = element.split(']]')
    const key = seconds[0]
    const value = strings[key]
    if (!value) {
      return seconds.join('')
    }
    seconds = seconds.length > 1
      ? seconds.slice(1, seconds.length)
      : seconds
    return [value, seconds].join('')
  })

  matched = matched.join('')
  return matched

}
