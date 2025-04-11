// Copyright (c) 2025 NTT InfraNet
import { select, call } from 'redux-saga/effects'

import { getViewer } from 'plugins/site/selectors'
import { getVisibleTopographyList } from '../../selectors'

import { getCesium3DTilePointCloudStyle } from 'utils/cesium'
import { CESIUM_ION_TYPES } from '../../constants'
import { saveSettings } from '../../../../utils/storage'
import { saveDataType } from '../../../../constants'

function * setTransparency ({ id, transparency }) {
  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)

  // ionAssetIdを取得
  const topographyList = yield select(getVisibleTopographyList)
  const { ionAssetId, ionAssetType, style } =
    topographyList.find(topography => topography.id === id) || {}

  if (!ionAssetId) return

  // localStorageに保存
  const parameters = {
    dataType: saveDataType.ASSET,
    id: id,
    style: { ...style, transparency }
  }
  yield call(saveSettings, parameters)

  if (ionAssetType === CESIUM_ION_TYPES.TILES3D) {
    const primitives = viewer.scene.primitives
    const primitivesLength = primitives.length
    let primitive
    for (let i = 0; i < primitivesLength; i++) {
      primitive = primitives.get(i)
      if (primitive.assetId === ionAssetId) break
    }

    if (primitive) {
      const topography =
        topographyList.find(topography => topography.id === id) || {}
      // 引数の値に透明度を設定
      primitive.style = getCesium3DTilePointCloudStyle(
        topography.pointSize,
        1 - transparency,
        topography.style.color
      )
    }
  }

  viewer.scene.requestRenderMode && viewer.scene.requestRender()
}

export default setTransparency
