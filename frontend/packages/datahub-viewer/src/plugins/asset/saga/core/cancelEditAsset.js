// Copyright (c) 2025 NTT InfraNet
// @flow
import { put, select } from 'redux-saga/effects'
import type { Saga } from 'redux-saga'

import { Matrix4 } from 'cesium'
import { clearEditAsset, closeDrawer } from 'plugins/asset/actions'
import {
  getAssetMetaData,
  getOriginData,
  getTransformEditor,
  getVisibleAssetList
} from 'plugins/asset/selectors'
import { getViewer } from 'plugins/site/selectors'

export function * cancelEditAssetSaga (): Saga<void> {
  const { assetId } = yield select(getAssetMetaData)

  const assetList = yield select(getVisibleAssetList)
  const { ionAssetId } = assetList.find(asset => asset.id === assetId) || {}
  if (!ionAssetId) return

  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)

  const primitives = viewer.scene.primitives
  const primitivesLength = primitives.length
  let primitive
  for (let i = 0; i < primitivesLength; i++) {
    const target = primitives.get(i)
    if (target.assetId === ionAssetId) {
      primitive = target
      break
    }
  }

  if (primitive) {
    const transformEditor = yield select(getTransformEditor)
    if (transformEditor) {
      transformEditor.destroy()
    }
    const { modelMatrix, rootTransform } = yield select(getOriginData)
    Matrix4.clone(modelMatrix, primitive.modelMatrix)
    Matrix4.clone(rootTransform, primitive.root.transform)
  }

  yield put(clearEditAsset())
  yield put(closeDrawer())
}
