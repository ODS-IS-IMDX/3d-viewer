// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  call,
  cancel,
  delay,
  fork,
  put,
  select,
  take
} from 'redux-saga/effects'

import { getUploadingFilesNumber } from 'plugins/file/selectors'
import {
  FILE_START_WATCH_UPLOAD_FILE,
  FILE_STOP_WATCH_UPLOAD_FILE,
  renewUploadingFilesNumber
} from 'plugins/file/actions'
import { uploadFiles } from './uploadFile'

import type { Saga } from 'redux-saga'

export function * watchUploadFileNumber (): Saga<void> {
  while (yield take(FILE_START_WATCH_UPLOAD_FILE)) {
    const uploadingTask = yield fork(keepUploading)
    yield take(FILE_STOP_WATCH_UPLOAD_FILE)
    yield cancel(uploadingTask)
    // listener廃止
    window.onbeforeunload = null
  }
}

export function * keepUploading (): Saga<void> {
  const MAX_PARALLEL_UPLOAD_NUMBER = 10
  // ファイルアップロード中ほかのページに遷移する場合警告を出すように unload の listener 追加
  window.onbeforeunload = event => {
    // イベントをキャンセルする
    event.preventDefault()
    // Chrome では returnValue を設定する必要がある
    event.returnValue = ''
  }
  while (true) {
    yield put(renewUploadingFilesNumber())
    const uploadingNumber = yield select(getUploadingFilesNumber)
    if (uploadingNumber < MAX_PARALLEL_UPLOAD_NUMBER) {
      yield call(uploadFiles, MAX_PARALLEL_UPLOAD_NUMBER - uploadingNumber)
    }
    yield delay(3000)
  }
}
