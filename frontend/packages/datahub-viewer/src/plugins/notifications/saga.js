// Copyright (c) 2025 NTT InfraNet
// @flow
import { eventChannel, type Saga } from 'redux-saga'
import {
  takeEvery,
  call,
  take,
  put,
  cancelled,
  select
} from 'redux-saga/effects'
import { toast } from 'react-toastify'

import {
  getAccessToken as getAccessTokenSelector,
  getLanguage
} from 'addons/auth'
import { getSiteId } from 'plugins/site/selectors'
import { updateList as updateAssetList } from 'plugins/asset/actions'
import {
  getTilingFilesNumber,
  renewUploadingFilesNumber
} from 'plugins/file/actions'
import { select as selectSite, loadSelectedSuccess } from 'plugins/site/actions'

import webSocketService from './service'
import {
  NOTIFY,
  NOTIFY_INIT,
  notifySuccess,
  notifyError,
  notifyInfo,
  notifyUpdate,
  type NotifyAction
} from './actions'
import {
  generateNotificationMessage,
  getMessageType,
  needUpdate,
  getNotificationAction
} from './utils'
import { NotificationMessage, Notification } from './constants'
import type { NotificationData } from './types'
import { api } from 'addons/api'

export function * connectWebSocket (siteId: string): Saga<void> {
  yield call(webSocketService.connect, siteId)
}

export function * connectWebSocketWithCurrentSession (): Saga<void> {
  const token = yield select(getAccessTokenSelector)
  yield call(webSocketService.connect, token)
}

export function * disconnectWebSocket (): Saga<void> {
  yield call(webSocketService.disconnect)
}

export function createWebSocketChannel () {
  // $FlowFixMe
  return eventChannel(emit => {
    webSocketService.on('notification', data => emit(data))

    return () => {
      webSocketService.off('notification')
    }
  })
}

export function * notifyMessage (data: NotificationData): Saga<void> {
  const language = yield select(getLanguage)
  const notificationMessage = generateNotificationMessage(data, language)
  if (notificationMessage === '') {
    return
  }

  const messageType = getMessageType(data.messageCode)
  if (messageType === NotificationMessage.SUCCESS) {
    yield put(notifySuccess(notificationMessage))
  } else if (messageType === NotificationMessage.ERROR) {
    yield put(notifyError(notificationMessage))
  } else if (messageType === NotificationMessage.UPDATE) {
    // 監視通知
    yield put(notifyUpdate(data.monitorName, notificationMessage))
  } else {
    yield put(notifyInfo(notificationMessage))
  }
}

export function * updateViewerData (
  notificationData: NotificationData
): Saga<void> {
  const { type, messageCode, siteId } = notificationData

  if (!siteId) {
    return
  }

  // アセット関連の通知が来たら、アップロード中及びタイリング中ファイル数を再度取得する
  if (type === Notification.ASSET) {
    yield put(getTilingFilesNumber(siteId))
    yield put(renewUploadingFilesNumber())
  }

  /**
   * アセット一覧の再取得
   * 再取得条件
   * ・ アセット更新の通知を受領
   * ・ 一覧の再取得が必要な通知の場合
   */
  if (type === Notification.ASSET && needUpdate(messageCode)) {
    const { site } = yield call(api.getSite, {
      siteId
    })
    yield put(loadSelectedSuccess(siteId, site))
  }

  /**
   * 現場情報の再取得
   * 再取得条件
   * ・ 現場情報更新の通知を受領
   * ・ 現場情報の再取得が必要な通知の場合
   */
  if (type === Notification.SITE && needUpdate(messageCode)) {
    yield put(selectSite(siteId))
  }

  /**
   * ファイル一括削除の際のAsset、注釈、画像、WMTSの一覧取得
   */
  if (type === Notification.SITE && needUpdate(messageCode)) {
    yield put(updateAssetList(siteId))
  }
}

export function * processAfterNotificationAction (
  notificationData: NotificationData
): Saga<void> {
  const { messageCode } = notificationData

  const notificationAction = getNotificationAction(messageCode)
  notificationAction() && (yield put(notificationAction()))
}

export function * watchWebsocketNotification (): Saga<void> {
  const currentSiteId = yield select(getSiteId)
  if (!currentSiteId) return
  yield call(connectWebSocket, currentSiteId)
  const webSocketChannel = yield call(createWebSocketChannel)

  try {
    while (true) {
      const data = yield take(webSocketChannel)

      // 通知にsiteIdが存在しているかどうかで、この通知は公開ページへの通知かどうかを判定する
      if (data.siteId) {
        // 公開ページではない場合：通知に含まれるSiteIDとViewerで表示しているSiteIDが異なる場合は何も実行しない
        if (data.siteId !== currentSiteId) {
          continue
        }
      }

      // メッセージを通知で表示する
      yield call(notifyMessage, data)

      // Viewerで使用しているデータ(アセット、注釈等)を更新する
      yield call(updateViewerData, data)

      // 通知発生後にreduxのactionを実施する
      yield call(processAfterNotificationAction, data)
    }
  } finally {
    // If the saga has been cancelled, disconnect the socket connection
    if (yield cancelled()) {
      yield call(webSocketService.disconnect)
    }
  }
}

export function * notifySaga ({ payload }: NotifyAction): Saga<void> {
  const { content, options } = payload
  yield call(toast, content, options)
}

export default function * saga (): Saga<void> {
  yield takeEvery(NOTIFY, notifySaga)
  yield takeEvery(NOTIFY_INIT, watchWebsocketNotification)
}
