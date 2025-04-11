// Copyright (c) 2025 NTT InfraNet
// @flow
import type { Saga } from 'redux-saga'
import { select } from 'redux-saga/effects'
import {
  getViewer,
  getMapControlMouseSettings,
  getMapControlKeySettings
} from '../selectors'
import { saveDataType } from '../../../constants'

function * setMapControl (): Saga<void> {
  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)
  // マップ操作設定を取得
  const mouseSettings = yield select(getMapControlMouseSettings)
  const keySettings = yield select(getMapControlKeySettings)

  // 設定を反映
  const mouseController = viewer.scene.screenSpaceCameraController
  if (mouseController) {
    // 水平移動
    mouseController.translateEventTypes = mouseSettings.horizontal
    // 回転操作
    mouseController.tiltEventTypes = mouseSettings.rotate
    // ズーム
    mouseController.zoomEventTypes = mouseSettings.zoom
  }

  // localStorageへ設定値を保存
  const parameters = {
    ...mouseSettings,
    ...keySettings
  }
  localStorage.setItem(saveDataType.MAP_CONTROL, JSON.stringify(parameters))
}

export default setMapControl
