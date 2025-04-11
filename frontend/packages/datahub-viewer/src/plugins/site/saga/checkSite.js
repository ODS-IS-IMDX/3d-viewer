// Copyright (c) 2025 NTT InfraNet
import { put, call } from 'redux-saga/effects'
import { api } from 'addons/api'
import { setIsViewerOpen } from '../actions'
import { setCesiumIonToken } from 'utils/cesium'

function * checkSiteSaga ({ siteId }) {
  try {
    // Call API
    const { site } = yield call(api.getSite, {
      siteId
    })
    setCesiumIonToken(site.cesiumIonToken)
    yield put(setIsViewerOpen(true))
  } catch (error) {
    yield put(setIsViewerOpen(false))
  }
}

export default checkSiteSaga
