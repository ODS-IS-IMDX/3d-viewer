// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import { api } from 'addons/api'
import { notifyError } from 'plugins/notifications/actions'
import {
  loadAssets,
  loadAssetsSuccess,
  loadAssetsError,
  setAssetParams,
  setTopographyPointSize,
  setAssetStyle
} from '../../actions'
import { getBaseTerrainList } from '../../selectors'
import { CesiumTerrainProvider } from 'cesium'
import { setTimelineShowData } from 'plugins/data/actions'
import { ASSET_STATUS, CESIUM_ION_TYPES, FORMAT_TYPE } from '../../constants'
import { generateErrorMessage } from '../../utils'
import { loadSettings } from '../../../../utils/storage'
import { saveDataType } from '../../../../constants'
import { filterLocalStorageTimelineItem } from 'plugins/data/utils'
import type { Saga } from 'redux-saga'
import { getViewer } from 'plugins/site/selectors'
import type { SiteID } from 'plugins/site/reducer'
import type { Asset } from 'plugins/asset/reducer'

function * loadAssetsSaga ({ siteId }: { siteId?: SiteID }): Saga<void> {
  try {
    yield put(loadAssets())

    const limit = 10
    let currentPage = 0
    let hasNext = true
    let items = []
    let result
    const defaultStyle = {
      color: '',
      transparency: 0
    }
    const gltfStyle = {
      color: '#FFFFFF',
      transparency: 0
    }
    let setStyle
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

    const settings = yield call(loadSettings, saveDataType.ASSET)
    const assets: Array<Asset> = items.map(item => {
      if (item.formatType === FORMAT_TYPE.GLTF.VALUE) {
        setStyle = gltfStyle
      } else {
        setStyle = defaultStyle
      }
      if (settings[item.id]) {
        return {
          ...item,
          displayName: item.displayName ? item.displayName : item.name,
          isDisplay: settings[item.id].isVisible,
          pointSize: settings[item.id].pointSize,
          style: settings[item.id].style || setStyle,
          isTransparency: true,
          isAvailable: settings[item.id].isVisible
        }
      } else {
        return {
          ...item,
          style: setStyle,
          isDisplay: false,
          isTransparency: true,
          displayName: item.displayName ? item.displayName : item.name
        }
      }
    })
    const inTimelineDataList = filterLocalStorageTimelineItem(assets)
    yield put(setTimelineShowData(inTimelineDataList, true))

    // データ日付時間を廃止したアセットをtimelineから外す
    const outTimelineDataList = assets.filter(
      asset => !asset.startDateTime || !asset.endDateTime
    )
    yield put(setTimelineShowData(outTimelineDataList, false))

    yield put(loadAssetsSuccess(assets))
    yield put(setAssetParams(result.isAssetRegistable))

    for (const asset of assets) {
      if (asset.formatType === FORMAT_TYPE.LASER.VALUE) {
        yield put(setTopographyPointSize(asset.id, asset.pointSize))
      }

      if (asset.ionAssetType === CESIUM_ION_TYPES.TILES3D) {
        yield put(setAssetStyle(asset.id, asset.style))
      }
    }
    // 初期地形データ選択
    const baseTerrainList = yield select(getBaseTerrainList)
    if (baseTerrainList && baseTerrainList.length > 0) {
      const baseTerrain = baseTerrainList[0]
      // Cesium.Viewerオブジェクトを取得
      const viewer = yield select(getViewer)
      viewer.terrainProvider = yield call(
        CesiumTerrainProvider.fromIonAssetId,
        baseTerrain.ionAssetId
      )
    }
  } catch (e) {
    yield put(loadAssetsError(e))
    // statusCode、messageCodeの内容に応じて出し分ける
    const statusCode = e && e.originalError && e.originalError.statusCode
    const messageCode = e && e.originalError && e.originalError.messageCode
    const message = generateErrorMessage(statusCode, messageCode)
    yield put(notifyError(message))
  }
}

export default loadAssetsSaga
