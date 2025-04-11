// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import { api } from 'addons/api'
import { getSiteId } from 'plugins/site/selectors'
import { notifyError } from 'plugins/notifications/actions'
import { setTimelineShowData } from 'plugins/data/actions'
import { generateErrorMessage } from 'plugins/file/utils'
import { FILE_TYPE } from 'plugins/file/constants'

import type { Saga } from 'redux-saga'
import type { AssetID } from 'plugins/asset/reducer'

export function * deleteFile ({
  fileType,
  id
}: {
  fileType: string,
  id: AssetID
}): Saga<void> {
  try {
    const siteId = yield select(getSiteId)
    switch (fileType) {
      case FILE_TYPE.ASSET: {
        const parameters = { siteId: siteId, assetId: id }
        yield call(api.deleteSiteAsset, parameters)
        // $FlowFixMe[infererror]: timelineからデータを外す時にidのみ必要なので、エラー抑制
        yield put(setTimelineShowData([{ id }], false))
        break
      }
      default:
        break
    }
  } catch (e) {
    const message = generateErrorMessage(e)
    yield put(notifyError(message))
  }
}
