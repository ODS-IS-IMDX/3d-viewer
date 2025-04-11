// Copyright (c) 2025 NTT InfraNet
import { takeEvery } from 'redux-saga/effects'

import { unwrap } from 'utils/saga'
import flyTo from './flyTo'
import show from './show'
import setPointSize from './setPointSize'
import setTransparency from './setTransparency'
import {
  TOPOGRAPHY_FLY_TO,
  TOPOGRAPHY_SET_VISIBILITY,
  TOPOGRAPHY_SET_POINTSIZE,
  TOPOGRAPHY_SET_TRANSPARENCY
} from '../../actions/'

export default function * saga () {
  yield takeEvery(TOPOGRAPHY_FLY_TO, unwrap(flyTo))
  yield takeEvery(TOPOGRAPHY_SET_VISIBILITY, unwrap(show))
  yield takeEvery(TOPOGRAPHY_SET_POINTSIZE, unwrap(setPointSize))
  yield takeEvery(TOPOGRAPHY_SET_TRANSPARENCY, unwrap(setTransparency))
}
