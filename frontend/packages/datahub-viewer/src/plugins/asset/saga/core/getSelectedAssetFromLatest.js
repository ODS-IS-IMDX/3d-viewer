// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import type { Saga } from 'redux-saga'
import { notifyError } from 'plugins/notifications/actions'
import { generateErrorMessage } from '../../utils'
import { getSiteId } from '../../../site/selectors'
import { api } from 'addons/api'
import { setSelectedAssetItem } from '../../actions'
import { type AssetGetSelectedFromLatestAction } from '../../actions/core/list'
import { ASSET_STATUS } from '../../constants'

/** アセット一覧から対象アセットの最新を取得する。 */
function * getSelectedAssetFromLatest (
  action: AssetGetSelectedFromLatestAction
): Saga<void> {
  try {
    const assetId = action.payload.assetId
    const siteId: string = yield select(getSiteId)
    const limit = 10
    let currentPage = 0
    let hasNext = true
    let items = []
    let result

    const parameters = { siteId, status: [ASSET_STATUS.CONVERTED] }
    while (hasNext) {
      // $FlowFixMe[infererror]: apiのtypeがないため、エラー抑制
      result = yield call(api.getSiteAssets, {
        ...parameters,
        limit,
        offset: limit * currentPage,
        sort: 'name',
        direction: 'ASC'
      })
      hasNext = !!result.next
      currentPage++
      items = [...items, ...(result.items || [])]
    }

    const asset = items.find((item, index) => {
      return item.ionAssetId === assetId
    })

    yield put(setSelectedAssetItem(asset))
  } catch (e) {
    const message = generateErrorMessage(e)
    yield put(notifyError(message))
  }
}

export default getSelectedAssetFromLatest
