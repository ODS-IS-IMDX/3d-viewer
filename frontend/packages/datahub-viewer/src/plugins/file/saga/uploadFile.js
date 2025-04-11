// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select, spawn, delay } from 'redux-saga/effects'
import axios, { CancelToken } from 'axios'
import config from 'config'
import i18n from 'i18n'
import { api } from 'addons/api'
import checksum from 'utils/checksum'
import { notifyError, notifySuccess } from 'plugins/notifications/actions'
import {
  changeStatus,
  deleteFileByTempId,
  setAssetId,
  setAxiosCancelSource,
  stopWatchUploadFile
} from 'plugins/file/actions'
import {
  CANCEL_UPLOAD_MESSAGE,
  FILE_UPLOAD_STATUS
} from 'plugins/file/constants'
import { generateErrorMessage, fileEvent } from 'plugins/file/utils'
import { getSiteId, getSiteBucketId } from 'plugins/site/selectors'
import { getUploadFileList } from 'plugins/file/selectors'

import type { Saga } from 'redux-saga'
import type { AssetID } from 'plugins/asset/reducer'
import type { UploadFile } from 'plugins/file/reducer'
import type { SiteID } from 'plugins/site/reducer'

export function * uploadFiles (uploadNumber: number): Saga<void> {
  const siteId: SiteID = yield select(getSiteId)
  const bucketId: string = yield select(getSiteBucketId)
  const uploadFileList = yield select(getUploadFileList)

  const needUploadFilesNumber = uploadFileList.filter(
    file =>
      file.status === FILE_UPLOAD_STATUS.WAITING ||
      file.status === FILE_UPLOAD_STATUS.UPLOADING ||
      file.status === FILE_UPLOAD_STATUS.DONE
  ).length

  // 全アップロード完了後
  if (needUploadFilesNumber === 0) {
    yield put(stopWatchUploadFile())
    return
  }

  let counter = 0
  for (let fileIndex = 0; fileIndex < uploadFileList.length; ++fileIndex) {
    const file = uploadFileList[fileIndex]
    if (file.status === FILE_UPLOAD_STATUS.WAITING) {
      ++counter
      const param = {
        siteId,
        bucketId,
        tempId: file.tempId,
        file: file.file,
        fileName: file.name,
        category: file.info.category,
        formatType: file.info.formatType,
        srid: file.info.cesiumOptions ? file.info.cesiumOptions.srid : null,
        verticalSrid: file.info.cesiumOptions
          ? file.info.cesiumOptions.verticalSrid
          : null,
        isTerrain: file.info.cesiumOptions
          ? file.info.cesiumOptions.isTerrain
          : null,
        startDateTime: file.info.startDateTime,
        endDateTime: file.info.endDateTime,
        isSpace: file.info.isSpace
      }

      yield put(
        changeStatus({
          tempId: file.tempId,
          status: FILE_UPLOAD_STATUS.UPLOADING
        })
      )
      yield spawn(uploadAsset, param)

      if (counter === uploadNumber) {
        return
      }
    }
  }
}

function * uploadAsset ({
  siteId,
  bucketId,
  tempId,
  file,
  fileName,
  category,
  formatType,
  srid,
  verticalSrid,
  flipXY,
  invertXY,
  flipTexture,
  tilesetJsonPath,
  isTerrain,
  position,
  customPosition: fileInfoCustomPosition,
  startDateTime,
  endDateTime,
  selectedBucketId,
  nodeId,
  isSpace
}): Saga<void> {
  try {
    // アセット登録要求のAPI
    const paramsPostSiteAsset = {
      // paramからnullを持つキーを除去する
      body: {
        name: fileName,
        displayName: fileName,
        category,
        formatType,
        cesiumOptions: {
          ...Object.fromEntries(
            Object.entries({
              srid: srid,
              verticalSrid: verticalSrid,
              isTerrain: isTerrain
            }).filter(([key, value]) => value !== null)
          )
        },
        startDateTime,
        endDateTime,
        isSpace
      },
      siteId: siteId
    }
    // $FlowFixMe[infererror]
    const resultPostSiteAsset = yield call(
      api.postSiteAsset,
      paramsPostSiteAsset
    )
    const assetId: AssetID = resultPostSiteAsset.asset.id
    yield put(setAssetId({ tempId, assetId }))

    // Datahub API経由でFile Storageにファイルアップロード
    if (!selectedBucketId && !nodeId) {
      yield call(uploadFileToStorage, {
        siteId,
        assetId,
        tempId,
        file,
        category: null
      })
    }

    const uploadFileList: Array<UploadFile> = yield select(getUploadFileList)

    const thisFile = uploadFileList.find(file => file.id === assetId)
    // // $FlowFixMe[infererror]
    if (thisFile.status === FILE_UPLOAD_STATUS.CANCELLED) {
      yield put(deleteFileByTempId(tempId))
      return
    }

    let digest = ''
    // アップロード完了通知のAPI
    if (file.size > 0) {
      digest = yield call(checksum, file)
    }

    // eslint-disable-next-line no-unused-vars
    const paramsPutSiteAssetUpload = {
      siteId: siteId,
      assetId,
      body: {
        checksum: digest
      }
    }
    let isWaitingProcessing = true
    // eslint-disable-next-line no-unused-vars
    let result
    // NOTE: 10秒ごとにアセットのステータスを確認し、アセットのステータスが"processing"でなくなるまで待機する
    while (isWaitingProcessing) {
      // TODO: onCompleteAPIが3DVでは存在しないため、コメントアウトし、強制的にisWaitingProcessingをfalseにする
      // result = yield call(api.putSiteAssetOnComplete, paramsPutSiteAssetUpload);
      // isWaitingProcessing = result.asset.isWaitingProcessing;
      isWaitingProcessing = false
      yield delay(10000)
    }
  } catch (e) {
    if (e.message === CANCEL_UPLOAD_MESSAGE) {
      yield put(
        notifySuccess(
          `${i18n.t('file:notification.cancelMessage')}\n${fileName}`
        )
      )
      return
    }
    if (!navigator.onLine) {
      yield put(
        notifyError(
          `${i18n.t('file:notification.networkDisconnected')}\n${fileName}`
        )
      )
      return
    }
    const statusCode = e && e.originalError && e.originalError.statusCode
    const messageCode = e && e.originalError && e.originalError.messageCode
    const message = generateErrorMessage(statusCode, messageCode)
    yield put(notifyError(message))
  } finally {
    yield put(deleteFileByTempId(tempId))
  }
}

export function * uploadFileToStorage ({
  siteId,
  assetId,
  tempId,
  file,
  category,
  startDateTime,
  endDateTime
}: {
  siteId: SiteID,
  assetId: AssetID,
  tempId: string,
  file: File,
  category: string | null,
  startDateTime?: Date,
  endDateTime?: Date
}): Saga<void> {
  try {
    const headers = {
      'Cache-Control': 'no-cache',
      // 'Content-Length': file.size, // ブラウザが自動で設定してくれるため、プログラムからの指定は不要。
      'Content-Type': 'application/octet-stream'
    }

    // axios cancel token
    const source = CancelToken.source()
    yield put(setAxiosCancelSource({ source, tempId }))

    const options = {
      headers: headers,
      onUploadProgress: progressEvent =>
        fileEvent.emitFileUploadProgressEvent({
          progressEvent,
          tempId
        }),
      cancelToken: source.token
    }

    const url = `${config.datahubServerUrl}/sites/${siteId}/assets/${assetId}/upload`
    yield call(axios.put, url, file, options)
  } catch (e) {
    throw e
  }
}

export function * cancelUpload ({ tempId }: { tempId: string }): Saga<void> {
  const uploadFileList: Array<UploadFile> = yield select(getUploadFileList)
  const cancelTargetFile = uploadFileList.find(file => file.tempId === tempId)
  const source = cancelTargetFile && cancelTargetFile.axiosCancelSource
  source && source.cancel(CANCEL_UPLOAD_MESSAGE)
}
