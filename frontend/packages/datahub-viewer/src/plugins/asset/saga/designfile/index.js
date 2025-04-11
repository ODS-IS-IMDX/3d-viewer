// Copyright (c) 2025 NTT InfraNet
import { takeEvery } from 'redux-saga/effects'

import { unwrap } from 'utils/saga'
import flyTo from './flyTo'
import show from './show'
import { DESIGNFILE_FLY_TO, DESIGNFILE_SET_VISIBILITY } from '../../actions/'

export default function * saga () {
  yield takeEvery(DESIGNFILE_FLY_TO, unwrap(flyTo))
  yield takeEvery(DESIGNFILE_SET_VISIBILITY, unwrap(show))
}
