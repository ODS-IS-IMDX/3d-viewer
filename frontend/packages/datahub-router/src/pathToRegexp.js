// Copyright (c) 2025 NTT InfraNet
export default function pathToRegexp (path, keys) {
  path = path
    .concat('/?')
    .replace(/\/\(/g, '(?:/')
    .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?|\*/g, tweak)
    .replace(/([/.])/g, '\\$1')
    .replace(/\*/g, '(.*)')

  return new RegExp('^' + path + '$', 'i')

  function tweak (match, slash, format, key, capture, optional) {
    if (match === '*') {
      keys.push(void 0)
      return match
    }

    keys.push(key)

    slash = slash || ''

    return (
      '' +
      (optional ? '' : slash) +
      '(?:' +
      (optional ? slash : '') +
      (format || '') +
      (capture
        ? capture.replace(/\*/g, '{0,}').replace(/\./g, '[\\s\\S]')
        : '([^/]+?)') +
      ')' +
      (optional || '')
    )
  }
}
