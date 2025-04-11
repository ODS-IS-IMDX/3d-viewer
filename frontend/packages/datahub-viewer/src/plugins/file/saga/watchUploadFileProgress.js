// Copyright (c) 2025 NTT InfraNet
// @flow
import { eventChannel } from 'redux-saga'
import { call, put, take } from 'redux-saga/effects'
import {
  renewUploadingFilesNumber,
  setUploadProgress
} from 'plugins/file/actions'
import { FILE_UPLOAD_PROGRESS_EVENT_NAME } from 'plugins/file/constants'
import { fileEvent } from 'plugins/file/utils'

import type { Saga } from 'redux-saga'

export function * watchUploadFileProgress (): Saga<void> {
  const eventChannel = yield call(createEventChannel)

  while (true) {
    const [tempId, progress] = yield take(eventChannel)
    yield put(setUploadProgress({ tempId, progress: parseInt(progress * 100) }))
    yield put(renewUploadingFilesNumber())
  }
}

export const createEventChannel = () =>
  eventChannel(emit => {
    fileEvent.on(FILE_UPLOAD_PROGRESS_EVENT_NAME, progress => emit(progress))
    // unsubscribeをすることはないため、何もしない関数をreturnする
    return () => {}
  })
