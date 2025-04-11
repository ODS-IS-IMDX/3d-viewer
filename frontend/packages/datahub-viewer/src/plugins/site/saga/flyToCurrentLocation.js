// Copyright (c) 2025 NTT InfraNet
// @flow
import type { Saga } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { getViewer } from 'plugins/site/selectors'
import { notifyError } from 'plugins/notifications/actions'
import { convertCoordinatesToCartesian3, flyToPoint } from 'utils/cesium'
import i18n from 'i18n'

function * flyToCurrentLocation (): Saga<void> {
  // Cesium.Viewerオブジェクトを取得
  const viewer = yield select(getViewer)

  try {
    // 現在地を取得
    const param = {
      enableHighAccuracy: true, // 高精度な現在地を取得
      timeout: 5000, // タイムアウト[ms]
      maximumAge: 0 // 現在地のキャッシュ利用時間[ms]
    }
    const position = yield call(getCurrentLocation, param)

    // 地図を現在地へ遷移させる
    const positionCartesian3 = convertCoordinatesToCartesian3(
      position.coords.longitude,
      position.coords.latitude,
      500
    )
    const option = {
      destination: positionCartesian3
    }
    flyToPoint(viewer, option)
  } catch (error) {
    let message = i18n.t('site:currentLocation.errors.default')

    if (error && error.code) {
      switch (error.code) {
        case 1: // 権限なし
          message = i18n.t('site:currentLocation.errors.permissionDenied')
          break
        case 2: // 現在地取得エラー
          message = i18n.t('site:currentLocation.errors.positionUnavailable')
          break
        case 3: // タイムアウト
          message = i18n.t('site:currentLocation.errors.timeout')
          break
        default:
          break
      }
    }

    yield put(notifyError(message))
  }
}

/**
 * 現在地の取得
 */
const getCurrentLocation = options => {
  return new Promise((resolve, reject) => {
    // javascriptのGeolocationAPIを利用
    navigator.geolocation.getCurrentPosition(resolve, reject, options)
  })
}

export default flyToCurrentLocation
