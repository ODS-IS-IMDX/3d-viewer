// Copyright (c) 2025 NTT InfraNet
// @flow
import type { Saga } from 'redux-saga'
import { select } from 'redux-saga/effects'
import { getMaterialFromType, convertCssColorToCesiumColor } from 'utils/cesium'
import { getViewer } from '../selectors'
import { getMaterialContourOptions } from '../selectors/materials'
import type { MaterialContourOptions } from '../types'

function * updateMaterialContour (): Saga<void> {
  // Viewerオブジェクトからglobeオブジェクトを取得
  const viewer: any = yield select(getViewer)

  if (viewer && viewer.scene && viewer.scene.globe) {
    const globe = viewer.scene.globe

    const options: MaterialContourOptions = yield select(
      getMaterialContourOptions
    )
    let material = null

    if (options.enable) {
      // 等高線表示用のMaterialを作成
      material = getMaterialFromType('ElevationContour')
      const uniforms = material.uniforms
      uniforms.width = 2
      uniforms.spacing = options.spacing
      uniforms.color = convertCssColorToCesiumColor(options.color)
    }

    // Viewerに等高線設定を適用
    globe.material = material

    // Viewerを再レンダリングさせる
    viewer.scene.requestRenderMode && viewer.scene.requestRender()
  }
}

export default updateMaterialContour
