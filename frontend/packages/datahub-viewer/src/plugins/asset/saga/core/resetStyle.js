// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import { getCesium3DTileStyle } from 'utils/cesium'
import { saveSettings } from 'utils/storage'
import { saveDataType } from '../../../../constants'
import { getViewer } from 'plugins/site/selectors'
import { getVisibleAssetList } from 'plugins/asset/selectors'
import { CESIUM_ION_TYPES } from 'plugins/asset/constants'
import { setAssetStyle } from '../../actions'
import type { AssetID } from 'plugins/asset/reducer'
import type { Saga } from 'redux-saga'

export function * resetStyle ({ id }: { id: AssetID }): Saga<void> {
  // localStorageに保存
  const parameters = { dataType: saveDataType.ASSET, id, style: {} }
  yield call(saveSettings, parameters)
  const viewer = yield select(getViewer)
  const assetList = yield select(getVisibleAssetList)
  const { ionAssetId, ionAssetType } =
    assetList.find(asset => asset.id === id) || {}
  if (!ionAssetId) return

  try {
    if (ionAssetType === CESIUM_ION_TYPES.TILES3D) {
      const primitives = viewer.scene.primitives
      const primitivesLength = primitives.length
      let primitive
      for (let i = 0; i < primitivesLength; i++) {
        primitive = primitives.get(i)
        if (primitive.assetId === ionAssetId) break
      }
      if (primitive) {
        primitive.style = getCesium3DTileStyle({
          color: '',
          opacity: 1,
          filter: {}
        })
      }
    }
    yield put(setAssetStyle(id, {}))
  } catch (e) {
    /*
     * アセットの種類が多く、全てのスタイルが変更できないアセットの把握できないので、
     * エラー発生時にもほかのアセット関連のsaga処理が止まらないように、
     * とりあえずエラーをキャッチして、そのままコンソールに出力
     */
    console.error(e)
  }
  viewer.scene.requestRenderMode && viewer.scene.requestRender()
}
