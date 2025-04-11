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
      'asset:common.assetCreationModal.fileRegisterModal.errorMessages.assetUploadValidationFailed',
    asset_upload_not_found:
      'asset:common.assetCreationModal.fileRegisterModal.errorMessages.assetUploadNotFound',
    asset_upload_not_found_bucket_id:
      'asset:common.assetCreationModal.fileRegisterModal.errorMessages.assetUploadNotFoundBucketId',
    asset_upload_limit:
      'asset:common.assetCreationModal.fileRegisterModal.errorMessages.assetUploadLimit',
    asset_upload_another_user:
      'asset:common.assetCreationModal.fileRegisterModal.errorMessages.assetUploadAnotherUser',
    asset_upload_error_s3_upload:
      'asset:common.assetCreationModal.fileRegisterModal.errorMessages.assetUploadErrorS3Upload',
    asset_upload_error_file_convert:
      'asset:common.assetCreationModal.fileRegisterModal.errorMessages.assetUploadErrorFileConvert',
    asset_upload_error_unsupportedzip:
      'asset:common.assetCreationModal.fileRegisterModal.errorMessages.assetUploadUnSupportedZip',
    // アセット削除時のエラー
    asset_delete_error_permission_required:
      'asset:common.notification.assetDeleteErrorPermissionRequired'
  }

  const statusCodeKeyMap = {
    '400': 'asset:common.notification.badRequestMessage',
    '401': 'asset:common.notification.tokenErrorMessage',
    '403': 'asset:common.notification.noAccessAuthErrorMessage',
    '404': 'asset:common.notification.notExistErrorMessage',
    '500': 'asset:common.notification.internalServerErrorMessage',
    '503': 'asset:common.notification.serviceUnavailableErrorMessage'
  }

  const defaultMessageKey =
    'asset:common.notification.internalServerErrorMessage'
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
