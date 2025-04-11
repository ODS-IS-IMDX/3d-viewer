// Copyright (c) 2025 NTT InfraNet
import pathToRegexp from './pathToRegexp'

export function match (route, uri) {
  const keys = []
  const re = pathToRegexp(route, keys)

  const splats = []
  const params = {}

  const captures = uri.match(re)

  if (!captures) {
    return
  }

  for (let j = 1, len = captures.length; j < len; ++j) {
    const value =
      typeof captures[j] === 'string'
        ? decodeURIComponent(captures[j])
        : captures[j]
    const key = keys[j - 1]
    if (key) {
      params[key] = value
    } else {
      splats.push(value)
    }
  }

  return {
    uri: captures[0].substring(0, captures[0].lastIndexOf(splats.join(''))),
    params,
    splats
  }
}

export default match
