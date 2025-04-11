// Copyright (c) 2025 NTT InfraNet
// @flow
import { call, put, select } from 'redux-saga/effects'
import type { Saga } from 'redux-saga'
import { api } from 'addons/api'
import { getSiteId } from 'plugins/site/selectors'
import { notifyError } from 'plugins/notifications/actions'
import i18n from 'i18n'

export default function * saga ({ viewStructure }): Saga<void> {
  const siteId = yield select(getSiteId)

  const param = {
    siteId,
    body: {
      viewStructure: viewStructure
    }
  }
  try {
    yield call(api.putSite, param)
  } catch (e) {
    yield put(notifyError(i18n.t('site:dataAdmin.errors.unableToSaveSite')))
  }
}
