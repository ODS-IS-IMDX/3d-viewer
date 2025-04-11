// Copyright (c) 2025 NTT InfraNet
// @flow

/// action types
export const SITE_NOTIFICATIONS_SET_IS_OPEN = 'SITE_NOTIFICATIONS_SET_IS_OPEN'
export const SITE_NOTIFICATIONS_SET_META_OPTIONS =
  'SITE_NOTIFICATIONS_SET_META_OPTIONS'
export const SITE_NOTIFICATIONS_SET_USERS = 'SITE_NOTIFICATIONS_SET_USERS'
export const SITE_NOTIFICATIONS_GET_NOTIFICATION_USERS =
  'SITE_NOTIFICATIONS_GET_NOTIFICATION_USERS'
export const SITE_NOTIFICATIONS_PUT_NOTIFICATION_USERS =
  'SITE_NOTIFICATIONS_PUT_NOTIFICATION_USERS'

/// type difinitions

export type SiteNotificationsSetIsOpenAction = {
  type: typeof SITE_NOTIFICATIONS_SET_IS_OPEN,
  payload: boolean
}

export type SiteNotificationsSetMetaOptionsAction = {
  type: typeof SITE_NOTIFICATIONS_SET_META_OPTIONS,
  payload: {
    isOpen?: boolean,
    isLoading?: boolean
  }
}

export type SiteNotificationsSetUsersAction = {
  type: typeof SITE_NOTIFICATIONS_SET_USERS,
  payload: any[]
}

export type SiteNotificationsGetNotificationUsersAction = {
  type: typeof SITE_NOTIFICATIONS_GET_NOTIFICATION_USERS
}

export type SiteNotificationsPutNotificationUsersAction = {
  type: typeof SITE_NOTIFICATIONS_PUT_NOTIFICATION_USERS,
  payload: string[]
}

export type SiteNotificationsAction =
  | SiteNotificationsSetIsOpenAction
  | SiteNotificationsSetMetaOptionsAction
  | SiteNotificationsSetUsersAction
  | SiteNotificationsGetNotificationUsersAction
  | SiteNotificationsPutNotificationUsersAction

/// action creators

/** 通知設定画面表示状態変更 */
export const setNotificatinosIsOpen = (
  isOpen: boolean
): SiteNotificationsSetIsOpenAction => {
  return {
    type: SITE_NOTIFICATIONS_SET_IS_OPEN,
    payload: isOpen
  }
}

/** 通知設定のメタ情報を設定 */
export const setNotificationsMetaOptions = (options: {
  isOpen?: boolean,
  isLoading?: boolean
}): SiteNotificationsSetMetaOptionsAction => {
  return {
    type: SITE_NOTIFICATIONS_SET_META_OPTIONS,
    payload: { ...options }
  }
}

/** ユーザ一覧を設定 */
export const setNotificationsUsers = (
  users: any[]
): SiteNotificationsSetUsersAction => {
  return {
    type: SITE_NOTIFICATIONS_SET_USERS,
    payload: users
  }
}

/** 通知先候補となるユーザ一覧を取得 */
export const getNotificationUsers = (): SiteNotificationsGetNotificationUsersAction => {
  return {
    type: SITE_NOTIFICATIONS_GET_NOTIFICATION_USERS
  }
}

/** 通知先ユーザ一覧を更新 */
export const putNotificationUsers = (
  userIds: string[]
): SiteNotificationsPutNotificationUsersAction => {
  return {
    type: SITE_NOTIFICATIONS_PUT_NOTIFICATION_USERS,
    payload: userIds
  }
}
