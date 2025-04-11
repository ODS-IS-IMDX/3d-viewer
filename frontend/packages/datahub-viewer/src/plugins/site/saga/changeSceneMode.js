// Copyright (c) 2025 NTT InfraNet
import { select } from 'redux-saga/effects'
import { getViewer } from 'plugins/site/selectors'
import { getScene2d, getScene3d, setReal3dShow } from 'utils/cesium'

function * changeSceneMode ({ mode }) {
  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)
  if (mode === 2) {
    viewer.scene.mode = getScene2d()
    viewer.scene.mapViewMode = getScene2d()
    setReal3dShow(viewer.scene.primitives, false)
  } else if (mode === 4) {
    viewer.scene.mode = getScene3d()
    viewer.scene.mapViewMode = 4
    setReal3dShow(viewer.scene.primitives, true)
  } else {
    viewer.scene.mode = getScene3d()
    viewer.scene.mapViewMode = getScene3d()
    setReal3dShow(viewer.scene.primitives, false)
  }
}

export default changeSceneMode
