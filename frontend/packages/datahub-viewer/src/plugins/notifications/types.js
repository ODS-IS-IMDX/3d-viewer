// Copyright (c) 2025 NTT InfraNet
// @flow
export type NotificationType = 'asset'

export type NotificationData = {
  messageCode: string,
  type: NotificationType,
  assetId?: string,
  userId?: string,
  errorMessage?: string,
  siteId?: string,
  targetName: string,
  userFirstName?: string,
  userLastName?: string,
  updatedAt: string
}
