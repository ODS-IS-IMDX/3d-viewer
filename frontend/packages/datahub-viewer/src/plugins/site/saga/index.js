// Copyright (c) 2025 NTT InfraNet
// @flow
import { takeEvery, takeLatest } from 'redux-saga/effects'
import { takeRoutes } from '@ehv/datahub-router'

import { unwrap } from 'utils/saga'
import { execSagaIfAuthenticated } from 'addons/auth/saga'

import routes from '../routes'
import {
  SITE_LOAD_SELECTED_SUCCESS,
  SITE_SELECT,
  SITE_SET_VIEW_STRUCTURE,
  SITE_CHECK,
  SITE_MODE_CHANGE,
  SITE_FLY_TO_CURRENT_LOCATION,
  SITE_SET_VIEWER_SHADOW_OPTIONS,
  MATERIAL_CONTOUR_SET_OPTIONS,
  SITE_SET_MAP_CONTROL_MOUSE_SETTINGS,
  SITE_SET_MAP_CONTROL_KEY_SETTINGS
} from '../actions'
import {
  SITE_NOTIFICATIONS_GET_NOTIFICATION_USERS,
  SITE_NOTIFICATIONS_PUT_NOTIFICATION_USERS
} from '../actions/notifications'

import redirectToSiteSaga from './redirectToSite'
import loadSelectedSaga from './loadSelected'
import updateSite from './updateSite'
import checkSiteSaga from './checkSite'
import changeSceneMode from './changeSceneMode'
import flyToCurrentLocation from './flyToCurrentLocation'
import updateShadowOptions from './updateShadowOptions'
import updateMaterialContour from './updateMaterialContour'
import setMapControl from './setMapControl'
import loadMapControl from './loadMapControl'
import getNotificationUsersSaga from './getNotificationUsers'
import putNotificationUsersSaga from './putNotificationUsers'

export default function * saga () {
  yield takeEvery(SITE_SELECT, unwrap(redirectToSiteSaga))
  yield takeEvery(SITE_SET_VIEW_STRUCTURE, unwrap(updateSite))
  yield takeEvery(SITE_CHECK, unwrap(checkSiteSaga))
  yield takeEvery(SITE_MODE_CHANGE, unwrap(changeSceneMode))
  yield takeEvery(SITE_SET_VIEWER_SHADOW_OPTIONS, unwrap(updateShadowOptions))
  yield takeEvery(SITE_FLY_TO_CURRENT_LOCATION, unwrap(flyToCurrentLocation))
  yield takeEvery(MATERIAL_CONTOUR_SET_OPTIONS, unwrap(updateMaterialContour))
  yield takeEvery(
    [SITE_SET_MAP_CONTROL_MOUSE_SETTINGS, SITE_SET_MAP_CONTROL_KEY_SETTINGS],
    unwrap(setMapControl)
  )
  yield takeEvery(SITE_LOAD_SELECTED_SUCCESS, unwrap(loadMapControl))
  yield takeLatest(
    SITE_NOTIFICATIONS_GET_NOTIFICATION_USERS,
    getNotificationUsersSaga
  )
  yield takeEvery(
    SITE_NOTIFICATIONS_PUT_NOTIFICATION_USERS,
    putNotificationUsersSaga
  )

  yield takeRoutes([
    {
      route: routes.site,
      handler: execSagaIfAuthenticated(loadSelectedSaga)
    }
  ])
}
