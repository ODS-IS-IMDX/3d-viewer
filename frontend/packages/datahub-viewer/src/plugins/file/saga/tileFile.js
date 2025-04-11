// Copyright (c) 2025 NTT InfraNet
// @flow
import { cancel, call, delay, fork, put, select } from 'redux-saga/effects'
import { api } from 'addons/api'
import { notifyError } from 'plugins/notifications/actions'
import { getSiteId } from 'plugins/site/selectors'
import { getNeedUploadFilesNumber } from 'plugins/file/selectors'
import {
  renewUploadingFilesNumber,
  setTilingFiles,
  setTilingFilesNumber,
  setErrorFilesNumber
} from 'plugins/file/actions'
import { generateErrorMessage } from 'plugins/file/utils'
import { FILE_TILE_STATUS } from 'plugins/file/constants'
import type { Saga } from 'redux-saga'
import type { SiteID } from 'plugins/site/reducer'

const TILING_STATUS = [
  FILE_TILE_STATUS.CONVERT_PREPARATION,
  FILE_TILE_STATUS.OC_CONVERT_UPLOADING,
  FILE_TILE_STATUS.OC_CONVERTING,
  FILE_TILE_STATUS.UPLOAD_S3_UP,
  FILE_TILE_STATUS.PRE_CONVERT_WAIT,
  FILE_TILE_STATUS.PRE_CONVERT_UPLOADING,
  FILE_TILE_STATUS.PRE_CONVERTING,
  FILE_TILE_STATUS.UPLOAD_WAIT,
  FILE_TILE_STATUS.UPLOADING,
  FILE_TILE_STATUS.UPLOADING_S3_DL,
  FILE_TILE_STATUS.UPLOADING_ION_UP,
  FILE_TILE_STATUS.CONVERTING,
  FILE_TILE_STATUS.S3_UPLOAD_WAIT,
  FILE_TILE_STATUS.S3_VIRUS_SCAN_IN_PROGRESS,
  FILE_TILE_STATUS.S3_VIRUS_SCAN_RESULT_NG,
  FILE_TILE_STATUS.S3_UPLOAD_COMPLETE,
  FILE_TILE_STATUS.S3_UPLOAD_COMPLETE_TO_CONVERT_TOOL,
  FILE_TILE_STATUS.CONVERT_TOOL_ERROR,
  FILE_TILE_STATUS.CONVERT_ERROR,
  FILE_TILE_STATUS.DELETE_ERROR,
  FILE_TILE_STATUS.DELETE_WAIT_ERROR,
  FILE_TILE_STATUS.S3_COPY_ERROR_FROM_CONVERT_TOOL,
  FILE_TILE_STATUS.S3_COPY_ERROR_FROM_EXTERNAL,
  FILE_TILE_STATUS.S3_UPLOAD_ERROR,
  FILE_TILE_STATUS.S3_UPLOAD_ERROR_TO_CONVERT_TOOL,
  FILE_TILE_STATUS.S3_VIRUS_SCAN_UPLOAD_ERROR
]

const ERROR_STATUS = [
  FILE_TILE_STATUS.CONVERT_TOOL_ERROR,
  FILE_TILE_STATUS.CONVERT_ERROR,
  FILE_TILE_STATUS.DELETE_ERROR,
  FILE_TILE_STATUS.DELETE_WAIT_ERROR,
  FILE_TILE_STATUS.S3_COPY_ERROR_FROM_CONVERT_TOOL,
  FILE_TILE_STATUS.S3_COPY_ERROR_FROM_EXTERNAL,
  FILE_TILE_STATUS.S3_UPLOAD_ERROR,
  FILE_TILE_STATUS.S3_UPLOAD_ERROR_TO_CONVERT_TOOL,
  FILE_TILE_STATUS.S3_VIRUS_SCAN_UPLOAD_ERROR
]

function * setFilesNumber (result) {
  const tilingFilesNumber = result.items
    ? result.items.filter(file => !ERROR_STATUS.includes(file.status)).length
    : 0
  const errorFilesNumber = result.items
    ? result.items.length - tilingFilesNumber
    : 0
  yield put(setTilingFilesNumber(tilingFilesNumber))
  yield put(setErrorFilesNumber(errorFilesNumber))
}

export function * getTilingFilesNumber ({
  siteId
}: {
  siteId: SiteID
}): Saga<void> {
  try {
    // $FlowFixMe[infererror]
    const result = yield call(api.getSiteAssets, {
      siteId,
      status: TILING_STATUS,
      needProgress: false
    })
    yield call(setFilesNumber, result)
  } catch (e) {
    // statusCode、messageCodeの内容に応じて出し分ける
    const statusCode = e && e.originalError && e.originalError.statusCode
    const messageCode = e && e.originalError && e.originalError.messageCode
    const message = generateErrorMessage(statusCode, messageCode)
    yield put(notifyError(message))
  }
}

let nextTask = null
let isPolling = false
export function * pollingTilingFilesProgress (): Saga<void> {
  isPolling = true
  const siteId: SiteID = yield select(getSiteId)
  const needUploadFilesNumber: number = yield select(getNeedUploadFilesNumber)
  try {
    // $FlowFixMe[infererror]
    const result = yield call(api.getSiteAssets, {
      siteId,
      status: TILING_STATUS,
      needProgress: true
    })
    yield put(setTilingFiles(result.items))
    // プログレス取得時に、ついでにデータ変換ファイル数もセットする
    yield call(setFilesNumber, result)
    yield put(renewUploadingFilesNumber())
    // アップロード完了かつタイリング完了の場合、ポーリング停止
    if (
      needUploadFilesNumber +
        result.items.filter(item => item.status !== FILE_TILE_STATUS.CONVERTED)
          .length ===
      0
    ) {
      yield call(stopPollingTilingFilesProgress)
      return
    }
    yield delay(3000)
    nextTask = yield fork(pollingTilingFilesProgress)
  } catch (e) {
    // statusCode、messageCodeの内容に応じて出し分ける
    const statusCode = e && e.originalError && e.originalError.statusCode
    const messageCode = e && e.originalError && e.originalError.messageCode
    const message = generateErrorMessage(statusCode, messageCode)
    yield put(notifyError(message))
  }
}

export function * stopPollingTilingFilesProgress (): Saga<void> {
  // ポーリング処理が走っていない場合、何もせず終了する
  if (!isPolling) {
    return
  }
  /*
   * cancelを無限ループに入れる原因：
   * nextTaskに値を格納するのは最初に一回目のapi.getSiteAssetsにリクエストを送ってレスポンスが返された3秒後なので、
   * もしcancelを無限ループに入れない場合、プログレスモーダルを開いてすぐ閉じると、
   * nextTask = undefinedになり、ポーリング処理のタスクのキャンセルができない
   */
  while (true) {
    yield delay(3000)
    if (nextTask) {
      yield cancel(nextTask)
      nextTask = null
      isPolling = false
      break
    }
  }
}
