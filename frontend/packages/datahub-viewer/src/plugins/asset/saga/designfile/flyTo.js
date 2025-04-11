// Copyright (c) 2025 NTT InfraNet
import { select } from 'redux-saga/effects'

import { getViewer } from 'plugins/site/selectors'
import { getVisibleDesignfileList } from '../../selectors'
import { CESIUM_ION_TYPES } from '../../constants'

function * flyToSaga ({ id }) {
  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)

  // 設計ファイルのionAssetIdを取得
  const designfileList = yield select(getVisibleDesignfileList)
  const { ionAssetId, ionAssetType } =
    designfileList.find(designfile => designfile.id === id) || {}

  if (!ionAssetId) return

  if (
    ionAssetType === CESIUM_ION_TYPES.TILES3D ||
    ionAssetType === CESIUM_ION_TYPES.GLTF
  ) {
    const primitives = viewer.scene.primitives
    const primitivesLength = primitives.length
    let primitive
    for (let i = 0; i < primitivesLength; i++) {
      primitive = primitives.get(i)
      if (primitive.assetId === ionAssetId) break
    }

    if (primitive) {
      // flytoで移動
      viewer.flyTo(primitive)
    }
  }
}

export default flyToSaga
