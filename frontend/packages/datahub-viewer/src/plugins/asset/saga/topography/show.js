// Copyright (c) 2025 NTT InfraNet
import { put, select, call } from 'redux-saga/effects'

import { getViewer } from 'plugins/site/selectors'
import { getLoadedTopographyList } from '../../selectors'
import { setTopographyPointSize, setAssetStyle } from '../../actions'
import { saveSettings } from '../../../../utils/storage'
import { saveDataType } from '../../../../constants'
import { FORMAT_TYPE } from 'plugins/asset/constants'

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

  // 点群のロード済みionAssetIdを取得
  const topographyList = yield select(getLoadedTopographyList)
  const { ionAssetId } =
    topographyList.find(topography => topography.id === id) || {}

  if (!ionAssetId) return

  const primitives = viewer.scene.primitives
  const primitivesLength = primitives.length
  let primitive
  for (let i = 0; i < primitivesLength; i++) {
    primitive = primitives.get(i)
    if (primitive.assetId === ionAssetId) break
  }

  // 表示する際に点群サイズ,透明度をセットする
  if (isVisible) {
    for (const asset of topographyList) {
      if (asset.id === id) {
        if (asset.formatType === FORMAT_TYPE.LASER.VALUE) {
          // NOTE: レンダリングタイミングによって正しくスタイルが当たらないためsleepを入れる
          yield sleep(10)
          yield put(setTopographyPointSize(asset.id, asset.pointSize))
        } else {
          yield put(setAssetStyle(asset.id, asset.style))
        }
      }
    }
  }

  if (primitive) {
    // showで表示・非表示切り替え
    primitive.show = isVisible
  }

  viewer.scene.requestRenderMode && viewer.scene.requestRender()
}

export default showSaga
