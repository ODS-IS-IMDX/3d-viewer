// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import { api } from 'addons/api'
import { generateErrorMessage } from 'plugins/file/utils'
import { getSiteId } from 'plugins/site/selectors'
import { notifyError } from 'plugins/notifications/actions'
import { removeFromDownloadingList } from 'plugins/file/actions'
import { FILE_TYPE } from 'plugins/file/constants'

import type { Saga } from 'redux-saga'
import type { SiteID } from 'plugins/site/reducer'

export function * downloadFile ({
  fileType,
  id
}: {
  fileType: string,
  id: string
}): Saga<void> {
  try {
    const siteId: SiteID = yield select(getSiteId)
    let response
    switch (fileType) {
      case FILE_TYPE.ASSET:
        // $FlowFixMe[infererror]: apiのtypeがないため、エラー抑制
        const request = api.getSiteAssetDownload
        const parameters = { siteId, assetId: id }
        response = yield call(request, parameters)
        break
      default:
        break
    }
    const contentDispositionHeader = response.headers.get('content-disposition')
    const fileName = decodeURIComponent(
      contentDispositionHeader.split('filename=')[1]
    )
    const file = yield response.blob()
    const fileUrl = URL.createObjectURL(file)
    const aTagDummy = document.createElement('a')

    aTagDummy.download = fileName
    aTagDummy.href = fileUrl
    aTagDummy.click()
  } catch (e) {
    // statusCode、messageCodeの内容に応じて出し分ける
    const statusCode = e && e.originalError && e.originalError.statusCode
    const messageCode = e && e.originalError && e.originalError.messageCode
    const message = generateErrorMessage(statusCode, messageCode)
    yield put(notifyError(message))
  } finally {
    yield put(removeFromDownloadingList(id))
  }
}
