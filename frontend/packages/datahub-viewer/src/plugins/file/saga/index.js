// Copyright (c) 2025 NTT InfraNet
// @flow
import { fork, takeEvery } from 'redux-saga/effects'
import { unwrap } from 'utils/saga'
import { SITE_LOAD_SELECTED_SUCCESS } from 'plugins/site/actions'
import {
  FILE_POLLING_TILING_FILES_PROGRESS,
  FILE_STOP_POLLING_TILING_FILES_PROGRESS,
  FILE_GET_TILING_FILES_NUMBER,
  FILE_CANCEL_UPLOAD,
  FILE_DELETE_FILE,
  FILE_DOWNLOAD_FILE
} from 'plugins/file/actions'
import { cancelUpload } from './uploadFile'
import { watchUploadFileProgress } from './watchUploadFileProgress'
import { watchUploadFileNumber } from './watchUploadFileNumber'
import {
  pollingTilingFilesProgress,
  stopPollingTilingFilesProgress,
  getTilingFilesNumber
} from './tileFile'
import { deleteFile } from './deleteFile'
import { downloadFile } from './downloadFile'

export * from './downloadFile'

export function * saga () {
  yield takeEvery([FILE_CANCEL_UPLOAD], unwrap(cancelUpload))
  yield takeEvery(
    [FILE_POLLING_TILING_FILES_PROGRESS],
    unwrap(pollingTilingFilesProgress)
  )
  yield takeEvery(
    [FILE_STOP_POLLING_TILING_FILES_PROGRESS],
    unwrap(stopPollingTilingFilesProgress)
  )
  yield takeEvery(
    [SITE_LOAD_SELECTED_SUCCESS, FILE_GET_TILING_FILES_NUMBER],
    unwrap(getTilingFilesNumber)
  )
  yield takeEvery([FILE_DELETE_FILE], unwrap(deleteFile))
  yield takeEvery([FILE_DOWNLOAD_FILE], unwrap(downloadFile))
  yield fork(watchUploadFileProgress)
  yield fork(watchUploadFileNumber)
}
