// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import type { Saga } from 'redux-saga'

import { Cesium3DTileset } from 'cesium'
import { modelFrameToEastNorthUp } from 'utils/cesium'
import {
  cancelEditAsset,
  openDrawer,
  setAssetData,
  updateEditingData
} from 'plugins/asset/actions'
import { getVisibleAssetList } from 'plugins/asset/selectors'
import { getViewer } from 'plugins/site/selectors'

export function * initEditingDataSaga ({
  asset
}: {
  asset: AssetInitEditingDataAction.payload
}): Saga<void> {
  const { assetId, customPosition } = asset

  const assetList = yield select(getVisibleAssetList)
  const { ionAssetId } = assetList.find(asset => asset.id === assetId) || {}
  if (!ionAssetId) return

  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)

  const primitives = viewer.scene.primitives
  const primitivesLength = primitives.length
  let primitive
  for (let i = 0; i < primitivesLength; i++) {
    primitive = primitives.get(i)
    if (primitive.assetId === ionAssetId) break
  }

  if (primitive) {
    yield put(cancelEditAsset())
    const tileset = yield call(Cesium3DTileset.fromIonAssetId, ionAssetId)
    modelFrameToEastNorthUp(tileset)

    const { transform } = customPosition || {}
    if (!transform) {
      modelFrameToEastNorthUp(primitive)
    }

    yield put(
      setAssetData({
        assetId: asset.assetId,
        subFileType: asset.subFileType,
        name: asset.name
      })
    )

    yield put(
      updateEditingData({
        displayName: asset.displayName,
        startDateTime:
          asset.startDateTime === null || asset.startDateTime === ''
            ? null
            : new Date(asset.startDateTime),
        endDateTime:
          asset.endDateTime === null || asset.endDateTime === ''
            ? null
            : new Date(asset.endDateTime)
      })
    )

    // flytoで移動
    viewer.flyTo(primitive, { duration: 0 })

    yield put(openDrawer())
  }
}
