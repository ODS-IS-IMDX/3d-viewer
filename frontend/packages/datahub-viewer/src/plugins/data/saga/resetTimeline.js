// Copyright (c) 2025 NTT InfraNet
// @flow
import { put, select } from 'redux-saga/effects'
import {
  closeDrawer,
  removeVisTimeline,
  removeTimelineShowData
} from 'plugins/data/actions'
import { getVisTimeline } from 'plugins/data/selectors'

import type { Saga } from 'redux-saga'

export function * resetTimelineSaga (): Saga<void> {
  const visTimeline = yield select(getVisTimeline)
  yield put(removeTimelineShowData())
  visTimeline &&
    visTimeline.visTimelineInstance &&
    (yield put(removeVisTimeline(visTimeline.visTimelineInstance)))
  yield put(closeDrawer())
}
