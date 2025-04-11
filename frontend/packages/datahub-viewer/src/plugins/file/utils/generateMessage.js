// Copyright (c) 2025 NTT InfraNet
// @flow
import i18n from 'i18n'

export const generateErrorMessage = (
  statusCode: number,
  messageCode: string
): string => {
  const messageCodeKeyMap = {
    // アセット登録時のエラー
    asset_upload_validation_failed:
      'file:notification.assetUploadValidationFailed',
    asset_upload_not_found: 'file:notification.assetUploadNotFound',
    asset_upload_not_found_bucket_id:
      'file:notification.assetUploadNotFoundBucketId',
    asset_upload_limit: 'file:notification.assetUploadLimit',
    asset_upload_another_user: 'file:notification.assetUploadAnotherUser',
    asset_upload_error_s3_upload: 'file:notification.assetUploadErrorS3Upload',
    asset_upload_error_file_convert:
      'file:notification.assetUploadErrorFileConvert',
    asset_upload_error_unsupportedzip:
      'file:notification.assetUploadUnSupportedZip',
    asset_upload_error_not_found_tilesetjson:
      'file:notification.assetUploadNotFoundTilesetJson',
    // アセット削除時のエラー
    asset_delete_error_permission_required:
      'file:notification.assetDeleteErrorPermissionRequired'
  }

  const statusCodeKeyMap = {
    '400': 'file:notification.badRequestMessage',
    '401': 'file:notification.tokenErrorMessage',
    '403': 'file:notification.noAccessAuthErrorMessage',
    '404': 'file:notification.notExistErrorMessage',
    '500': 'file:notification.internalServerErrorMessage',
    '503': 'file:notification.serviceUnavailableErrorMessage'
  }

  const defaultMessageKey = 'file:notification.internalServerErrorMessage'
  if (messageCode) {
    const messageKey = messageCodeKeyMap[messageCode] || defaultMessageKey
    return i18n.t(messageKey)
  } else if (statusCode) {
    const messageKey = statusCodeKeyMap[statusCode] || defaultMessageKey
    return i18n.t(messageKey)
  } else {
    return i18n.t(defaultMessageKey)
  }
}
