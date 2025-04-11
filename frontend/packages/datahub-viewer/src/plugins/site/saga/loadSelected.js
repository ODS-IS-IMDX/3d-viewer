// Copyright (c) 2025 NTT InfraNet
// @flow
import { put, call } from 'redux-saga/effects'
import i18n from 'i18n'
import { setCesiumIonToken } from 'utils/cesium'
import { api } from 'addons/api'
import { notifyError } from 'plugins/notifications/actions'

import {
  loadSelected,
  loadSelectedError,
  loadSelectedSuccess,
  setIsViewerOpen
} from '../actions'

import type { Saga } from 'redux-saga'
import type { SiteID } from 'plugins/site/reducer'

function * loadSelectedSaga ({ siteId }: { siteId: SiteID }): Saga<void> {
  try {
    // Dispatch load action
    yield put(loadSelected(siteId))
    // Call API
    const { site } = yield call(api.getSite, {
      siteId
    })

    setCesiumIonToken(site.cesiumIonToken)

    // Dispatch success action with site
    yield put(setIsViewerOpen(true))
    yield put(loadSelectedSuccess(siteId, site))
  } catch (error) {
    yield put(loadSelectedError(error))
    yield put(notifyError(i18n.t('site:errors.unableToLoadSite')))
  }
}

export default loadSelectedSaga
