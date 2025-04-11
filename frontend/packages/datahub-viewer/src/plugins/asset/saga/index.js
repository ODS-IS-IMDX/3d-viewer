// Copyright (c) 2025 NTT InfraNet
// @flow
import { fork } from 'redux-saga/effects'

import initializeCoreSaga from './core'
import initializeTopographySaga from './topography'
import initializeDesignfileSaga from './designfile/'

export default function * saga () {
  yield fork(initializeCoreSaga)
  yield fork(initializeTopographySaga)
  yield fork(initializeDesignfileSaga)
}
