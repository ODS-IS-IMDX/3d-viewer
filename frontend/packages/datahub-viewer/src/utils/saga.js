// Copyright (c) 2025 NTT InfraNet
import { put } from 'redux-saga/effects'
import { push } from 'redux-first-history'

export function unwrap (saga) {
  return function * ({ payload }) {
    yield * saga(payload)
  }
}

export function redirect (route) {
  return function * (params) {
    yield put(push(route.fill(params)))
  }
}
