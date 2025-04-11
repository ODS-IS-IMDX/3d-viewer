// Copyright (c) 2025 NTT InfraNet
// @flow
import type { Saga } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import { api } from 'addons/api'
import * as notificationsActions from 'plugins/site/actions/notifications'
import { generateErrorMessage } from 'plugins/site/utils/generateMessage'
import type { SiteNotificationsPutNotificationUsersAction } from '../actions/notifications'
import { notifyError } from '../../notifications/actions'
import { getSiteId } from '../selectors'

function * putNotificationUsersSaga (
  action: SiteNotificationsPutNotificationUsersAction
): Saga<void> {
  try {
    yield put(
      notificationsActions.setNotificationsMetaOptions({ isLoading: true })
    )

    const siteId = yield select(getSiteId)

    // 通知先ユーザ一覧を更新
    const params = {
      siteId,
      body: {
        loginUserIds: action.payload
      }
    }
    yield call(api.putSiteContacts, params)

    // 更新後の最新データを再取得
    yield put(notificationsActions.getNotificationUsers()) // 別のSagaに委任
  } catch (error) {
    const message = generateErrorMessage(error)
    yield put(notifyError(message))
    yield put(
      notificationsActions.setNotificationsMetaOptions({ isLoading: false })
    )
  }
}

export default putNotificationUsersSaga
