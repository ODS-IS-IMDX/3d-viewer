// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  type SiteNotificationsAction,
  SITE_NOTIFICATIONS_SET_IS_OPEN,
  SITE_NOTIFICATIONS_SET_META_OPTIONS,
  SITE_NOTIFICATIONS_SET_USERS
} from '../actions/notifications'

export type SiteNotificationsState = {
  /** メタ情報 */
  meta: {
    /** 通知設定画面の表示状態 */
    isOpen: boolean,
    /** 通知設定画面のロード状態 */
    isLoading: boolean
  },
  /** 通知先一覧の候補となるユーザ一覧 */
  users: any[]
}

const initialState: SiteNotificationsState = {
  meta: {
    isOpen: false,
    isLoading: false
  },
  users: []
}

const notificationsReducer = (
  state: SiteNotificationsState = initialState,
  action: SiteNotificationsAction
): SiteNotificationsState => {
  let result: SiteNotificationsState = state
  switch (action.type) {
    case SITE_NOTIFICATIONS_SET_IS_OPEN:
      result = {
        ...state,
        meta: {
          ...state.meta,
          isOpen: action.payload
        }
      }
      break
    case SITE_NOTIFICATIONS_SET_META_OPTIONS:
      result = {
        ...state,
        meta: {
          ...state.meta,
          isOpen:
            action.payload.isOpen != null
              ? action.payload.isOpen
              : state.meta.isOpen,
          isLoading:
            action.payload.isLoading != null
              ? action.payload.isLoading
              : state.meta.isLoading
        }
      }
      break
    case SITE_NOTIFICATIONS_SET_USERS:
      result = {
        ...state,
        users: action.payload
      }
      break
    default:
      break
  }
  return result
}

export default notificationsReducer
