// Copyright (c) 2025 NTT InfraNet
// @flow
import type { Saga } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { api } from 'addons/api'
import { getSiteId } from 'plugins/site/selectors'
import { notifyError } from 'plugins/notifications/actions'
import * as notificationsActions from 'plugins/site/actions/notifications'
import { generateErrorMessage } from 'plugins/site/utils/generateMessage'

function * getNotificationUsersSaga (): Saga<void> {
  try {
    yield put(
      notificationsActions.setNotificationsMetaOptions({ isLoading: true })
    )

    // 現場に紐づくユーザ一覧を取得
    const siteId: string = yield select(getSiteId)
    const param = { siteId }
    const response = yield call(api.getSiteContacts, param)

    // 取得したユーザ一覧をStoreへ保存
    yield put(notificationsActions.setNotificationsUsers(response.items))
  } catch (error) {
    const message = generateErrorMessage(error)
    yield put(notifyError(message))
  } finally {
    yield put(
      notificationsActions.setNotificationsMetaOptions({ isLoading: false })
    )
  }
}

export default getNotificationUsersSaga
