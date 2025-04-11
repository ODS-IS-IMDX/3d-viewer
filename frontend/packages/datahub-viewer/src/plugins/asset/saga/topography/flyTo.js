// Copyright (c) 2025 NTT InfraNet
import { select } from 'redux-saga/effects'

import { getViewer } from 'plugins/site/selectors'
import { getVisibleTopographyList } from '../../selectors'

function * flyToSaga ({ id }) {
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
    // flytoで移動
    viewer.flyTo(primitive)
  }
}

export default flyToSaga
