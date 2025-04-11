// Copyright (c) 2025 NTT InfraNet
// @flow
import type { Saga } from 'redux-saga'
import { put } from 'redux-saga/effects'
import {
  setMapControlMouseSettings,
  setMapControlKeySettings
} from '../actions'
import { saveDataType } from '../../../constants'

function * loadMapControl (): Saga<void> {
  // localStorageからマップ操作設定を読み込む
  const settings = localStorage.getItem(saveDataType.MAP_CONTROL)
  if (settings != null) {
    const mapControls = JSON.parse(settings)

    // Storeへ適用
    yield put(
      setMapControlMouseSettings(
        mapControls.horizontal,
        mapControls.rotate,
        mapControls.zoom
      )
    )
    yield put(
      setMapControlKeySettings(
        mapControls.zoomIn,
        mapControls.zoomOut,
        mapControls.moveUp,
        mapControls.moveDown,
        mapControls.moveFoward,
        mapControls.moveBackward,
        mapControls.moveLeft,
        mapControls.moveRight,
        mapControls.rotateUp,
        mapControls.rotateDown,
        mapControls.rotateLeft,
        mapControls.rotateRight,
        mapControls.twistLeft,
        mapControls.twistRight
      )
    )
  }
}

export default loadMapControl
