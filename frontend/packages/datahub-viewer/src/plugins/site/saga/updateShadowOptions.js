// Copyright (c) 2025 NTT InfraNet
// @flow
import type { Saga } from 'redux-saga'
import { select } from 'redux-saga/effects'
import {
  createPointCloudShadingInstance,
  isSupportedPointCloudShading
} from 'utils/cesium'
import { getViewer, getShadowOptions } from '../selectors'
import { getAssetList } from '../../asset/selectors/core/assetList'
import type { ShadowOptions } from '../types'
import type { Asset } from '../../asset/reducer'
import { CESIUM_ION_TYPES } from '../../asset/constants'

const ENABLED = 1
const RECIEVE_ONLY = 3

/**
 * 影表示設定を更新
 */
function * updateShadowOptions (): Saga<void> {
  const viewer = yield select(getViewer)
  const options: ShadowOptions = yield select(getShadowOptions)
  const assets: Array<Asset> = yield select(getAssetList)
  const defaultPointCloudShadingInstance = createPointCloudShadingInstance()
  const customizedPointCloudShadingInstance = createPointCloudShadingInstance({
    attenuation: isSupportedPointCloudShading(viewer),
    maximumAttenuation: 1
  })

  // 設定の反映 (1: ENABLED, 3: RECIEVE_ONLY)
  viewer.shadows = options.isShadow
  // アセット(shadowが有効な3DTileのみ)
  const assets3d = assets.filter(
    assets => assets.ionAssetType === CESIUM_ION_TYPES.TILES3D
  )
  const primitives = viewer.scene.primitives

  if (assets3d.length > 0 && primitives.length > 0) {
    assets3d.forEach(asset => {
      // primitiveオブジェクトを取得し、影の設定を反映
      let primitive
      for (let i = 0; i < primitives.length; i++) {
        const target = primitives.get(i)
        if (target.assetId === asset.ionAssetId) {
          primitive = target
          break
        }
      }
      if (primitive) {
        primitive.shadows = options.isEntityShadow ? ENABLED : RECIEVE_ONLY
        primitive.pointCloudShading =
          options.isShadow && options.isEntityShadow
            ? defaultPointCloudShadingInstance
            : customizedPointCloudShadingInstance
      }
    })
  }
  // 地形
  viewer.terrainShadows = options.isTerrainShadow ? ENABLED : RECIEVE_ONLY

  // Viewerを再レンダリングさせる
  viewer.scene.requestRenderMode && viewer.scene.requestRender()
}

export default updateShadowOptions
