// Copyright (c) 2025 NTT InfraNet
// @flow
import i18n from 'i18n'

import {
  generateLocalizedFullName,
  generateLocalizedDate
} from 'utils/localization'
import { NotificationMessage } from './constants'
import type { NotificationData } from './types'

type NotificationMetaInfoType = {
  [messageCode: string]: {
    action?: () => Object, // 該当通知発生後に実施するreduxのaction
    needUpdate: boolean, // アセット一覧や注釈一覧等の更新が必要かを表すフラグ
    messageType: string, // 通知の種別(success, error)
    messageKey: string // i18で定義したメッセージのkey名
  }
}

const notificationMetaInfo: NotificationMetaInfoType = {
  // アセット
  asset_upload_start: {
    needUpdate: true,
    messageType: NotificationMessage.SUCCESS,
    messageKey: 'notifications:asset.assetUploadStart'
  },
  asset_upload_error_llfs_download: {
    needUpdate: false,
    messageType: NotificationMessage.ERROR,
    messageKey: 'notifications:asset.assetUploadErrorLLFSDownload'
  },
  asset_upload_error_llfs_upload: {
    needUpdate: false,
    messageType: NotificationMessage.ERROR,
    messageKey: 'notifications:asset.assetUploadErrorLLFSUpload'
  },
  asset_upload_error: {
    needUpdate: false,
    messageType: NotificationMessage.ERROR,
    messageKey: 'notifications:asset.assetUploadError'
  },
  asset_convert_success: {
    needUpdate: true,
    messageType: NotificationMessage.SUCCESS,
    messageKey: 'notifications:asset.assetConvertSuccess'
  },
  asset_convert_error_data: {
    needUpdate: false,
    messageType: NotificationMessage.ERROR,
    messageKey: 'notifications:asset.assetConvertErrorData'
  },
  asset_convert_error: {
    needUpdate: false,
    messageType: NotificationMessage.ERROR,
    messageKey: 'notifications:asset.assetConvertError'
  },
  asset_delete_complete: {
    needUpdate: true,
    messageType: NotificationMessage.SUCCESS,
    messageKey: 'notifications:asset.assetDeleteComplete'
  },
  asset_delete_error: {
    needUpdate: false,
    messageType: NotificationMessage.ERROR,
    messageKey: 'notifications:asset.assetDeleteError'
  },
  asset_create_ehv_space_info_error: {
    needUpdate: false,
    messageType: NotificationMessage.ERROR,
    messageKey: 'errorMessage'
  },
  // ファイル一括削除
  site_multiple_data_delete_success: {
    needUpdate: true,
    messageType: NotificationMessage.SUCCESS,
    messageKey: 'notifications:data.fileDeleteComplete'
  },
  // 現場
  site_update_success: {
    needUpdate: true,
    messageType: NotificationMessage.SUCCESS,
    messageKey: 'notifications:site.siteUpdateSuccess'
  }
}

export const generateNotificationMessage = (
  data: NotificationData,
  language: string | null
) => {
  const {
    messageCode,
    type,
    targetName,
    updatedAt,
    userFirstName,
    userLastName,
    errorMessage
  } = data

  const notificationMessage = notificationMetaInfo[messageCode]

  if (!notificationMessage) {
    return ''
  }

  let result = ''
  let message: string =
    messageCode === 'asset_create_ehv_space_info_error'
      ? errorMessage
      : i18n.t(notificationMetaInfo[messageCode].messageKey)
  const dataName = getDataName(type, targetName) || ''
  const localizedDate = generateLocalizedDate(
    updatedAt,
    i18n.t('notifications:common.dateFormat')
  )
  const localizedName =
    userFirstName && userLastName && language
      ? generateLocalizedFullName(userFirstName, userLastName, language)
      : ''
  const dateAndUser = `${localizedDate} ${localizedName}`
  result = `${message}\n${`${dataName}`}\n${dateAndUser}`

  return result
}

const getDataName = (type: string, targetName: string): string => targetName

export const needUpdate = (messageCode: string): boolean => {
  if (!notificationMetaInfo[messageCode]) {
    return false
  }

  return notificationMetaInfo[messageCode].needUpdate
}

export const getMessageType = (messageCode: string): string => {
  if (
    !notificationMetaInfo[messageCode] ||
    !notificationMetaInfo[messageCode].messageType
  ) {
    return NotificationMessage.INFO
  }

  return notificationMetaInfo[messageCode].messageType
}

export const getNotificationAction = (
  messageCode: string
): (() => null | Object) => {
  if (
    !notificationMetaInfo[messageCode] ||
    !notificationMetaInfo[messageCode].action
  ) {
    return () => null
  }

  return notificationMetaInfo[messageCode].action
}
