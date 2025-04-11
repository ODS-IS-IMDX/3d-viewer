// Copyright (c) 2025 NTT InfraNet
import { takeEvery, takeLatest } from 'redux-saga/effects'

import { unwrap } from 'utils/saga'
import { SITE_LOAD_SELECTED } from 'plugins/site/actions'
import { resetTimelineSaga } from './resetTimeline'
import bulkDelete from './bulkDelete'
import { DATA_DELETE_FILE } from '../actions'

export function * saga () {
  yield takeEvery([SITE_LOAD_SELECTED], unwrap(resetTimelineSaga))
  yield takeLatest(DATA_DELETE_FILE, bulkDelete)
}
