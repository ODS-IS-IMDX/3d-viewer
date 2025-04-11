// Copyright (c) 2025 NTT InfraNet
import { put, call } from 'redux-saga/effects'

import { api } from 'addons/api'

import {
  loadCCRSList,
  loadCCRSListError,
  loadCCRSListSuccess
} from '../actions'

function * loadCCRSListSaga ({ data: { id } }) {
  try {
    yield put(loadCCRSList())

    const result = yield call(api.getAllCCRSBySite, {
      siteId: id
    })

    yield put(loadCCRSListSuccess(result.items || []))
  } catch (error) {
    yield put(loadCCRSListError(error))
  }
}

export default loadCCRSListSaga
