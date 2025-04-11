// Copyright (c) 2025 NTT InfraNet
import { join } from 'path'
import { createSelector } from 'reselect'

import { match } from './match'
import { sanitize } from './utils'

const fill = path => obj =>
  Object.entries(obj).reduce(
    (string, [key, value]) => string.replace(`:${key}`, value),
    path
  )

export function buildRoute (name, route) {
  const action = `@@router/ROUTE_${name.toUpperCase()}_${Date.now()}`
  const path = join(route.path, '*')

  const parent = route.parent
  const relative = route.path
  const absolute = route.parent
    ? join(route.parent.absolute, relative)
    : join('/', relative)
  const wildcard = join(absolute, '*')
  const selector = createSelector(
    state => (state.router ? state.router.location.pathname : undefined),
    pathname => {
      const result = match(wildcard, sanitize(pathname))
      return result ? result.params : undefined
    }
  )

  const result = {
    path,
    action,
    parent,
    relative,
    absolute,
    wildcard,
    selector,
    fill: fill(absolute)
  }

  const children = Object.entries(route.children || {}).reduce(
    (children, [name, route]) => {
      children[name] = buildRoute(name, { ...route, parent: result })
      return children
    },
    {}
  )

  return {
    ...children,
    ...result
  }
}

export function buildRoutes (obj) {
  return Object.entries(obj).reduce((result, [name, route]) => {
    result[name] = buildRoute(name, route)
    return result
  }, {})
}
