// Copyright (c) 2025 NTT InfraNet
import { select, call } from 'redux-saga/effects'

import { getViewer } from 'plugins/site/selectors'
import { getVisibleTopographyList } from '../../selectors'

import { getCesium3DTilePointCloudStyle } from 'utils/cesium'
import { saveSettings } from '../../../../utils/storage'
import { saveDataType } from '../../../../constants'

function * setPointSize ({ id, pointSize }) {
  // localStrageに保存
  const parameters = {
    dataType: saveDataType.ASSET,
    id: id,
    pointSize: pointSize
  }
  yield call(saveSettings, parameters)
  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)

  // 点群のionAssetIdを取得
  const topographyList = yield select(getVisibleTopographyList)
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

  if (primitive) {
    // 引数の値にサイズを設定
    const topography =
      topographyList.find(topography => topography.id === id) || {}
    const pointSize = topography.pointSize || 1
    const transparency = topography.style.transparency || 0
    const color = topography.style.color
    primitive.style = getCesium3DTilePointCloudStyle(
      pointSize,
      1 - transparency,
      color
    )
  }
  viewer.scene.requestRenderMode && viewer.scene.requestRender()
}

export default setPointSize
