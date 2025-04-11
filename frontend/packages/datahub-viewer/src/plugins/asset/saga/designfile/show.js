// Copyright (c) 2025 NTT InfraNet
import { select, call, put } from 'redux-saga/effects'

import { getViewer } from 'plugins/site/selectors'
import { getLoadedDesignfileList } from '../../selectors'
import { setAssetStyle } from '../../actions'
import { CESIUM_ION_TYPES } from '../../constants'
import { saveSettings } from '../../../../utils/storage'
import { saveDataType } from '../../../../constants'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
function * showSaga ({ id, isVisible }) {
  // localStrageに保存
  const parameters = {
    dataType: saveDataType.ASSET,
    id: id,
    isVisible: isVisible
  }
  yield call(saveSettings, parameters)
  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)

  // 設計ファイルのロード済みionAssetIdを取得
  const designfileList = yield select(getLoadedDesignfileList)
  const { ionAssetId, ionAssetType } =
    designfileList.find(designfile => designfile.id === id) || {}

  if (!ionAssetId) return

  if (ionAssetType === CESIUM_ION_TYPES.TILES3D) {
    const primitives = viewer.scene.primitives
    const primitivesLength = primitives.length
    let primitive
    for (let i = 0; i < primitivesLength; i++) {
      primitive = primitives.get(i)
      if (primitive.assetId === ionAssetId) break
    }

    if (isVisible) {
      for (const asset of designfileList) {
        if (asset.id === id) {
          // NOTE: レンダリングタイミングによって正しくスタイルが当たらないためsleepを入れる
          yield sleep(10)
          yield put(setAssetStyle(asset.id, asset.style))
        }
      }
    }

    if (primitive) {
      // showで表示・非表示切り替え
      primitive.show = isVisible
    }
  }

  viewer.scene.requestRenderMode && viewer.scene.requestRender()
}

export default showSaga
