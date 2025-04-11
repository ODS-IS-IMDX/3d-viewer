// Copyright (c) 2025 NTT InfraNet
import { match } from './match'
import { all, take, fork, select } from 'redux-saga/effects'
import { sanitize } from './utils'

export const AFTER = 'AFTER'
export const PARALLEL = 'PARALLEL'
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE'

export function * takeRoutes (routes = []) {
  yield all(
    routes.map(({ route, handler, ...opts }) => takeRoute(route, handler, opts))
  )
}

export function takeRoute (route, handler, opts) {
  return fork(takeRouteSaga, route, handler, opts)
}

export function * takeRouteSaga (route, handler, opts) {
  const handleRouteSaga = handleRouteSagaFactory(route, handler, opts)

  const state = yield select()
  yield fork(handleRouteSaga, state.router.location)

  while (true) {
    const { payload } = yield take(LOCATION_CHANGE)
    yield fork(handleRouteSaga, payload.location)
  }
}

export function handleRouteSagaFactory (
  route,
  handler,
  { order = AFTER, onEnter, onLeave } = {}
) {
  let previous
  return function * handleRouteSaga ({ pathname }) {
    const result = match(route.wildcard, sanitize(pathname))

    if (result) {
      if (!previous && onEnter) {
        yield * onEnter(result.params)
      }

      if (!previous || result.uri !== previous.uri) {
        if (handler) {
          yield * handler(result.params)
        }
      }
    } else {
      if (previous && onLeave) {
        yield * onLeave()
      }
    }

    previous = result
  }
}
