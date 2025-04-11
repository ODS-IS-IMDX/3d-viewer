// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { SiteNotificationsState } from '../reducer/notifications'

const siteNotificationsStateSelector = (
  state: RootState
): SiteNotificationsState => state.site.notifications

/** 通知設定画面の表示状態を取得 */
export const getNotificationsIsOpen = createSelector(
  siteNotificationsStateSelector,
  notifications => notifications.meta.isOpen
)

/** 通知設定画面のメタ情報を取得 */
export const getNotificationsIsLoading = createSelector(
  siteNotificationsStateSelector,
  notifications => notifications.meta.isLoading
)

/** 通知先ユーザ情報取得 */
export const getNotificationsUsers = createSelector(
  siteNotificationsStateSelector,
  notifications => notifications.users
)
