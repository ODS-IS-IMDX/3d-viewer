// Copyright (c) 2025 NTT InfraNet
// @flow
import i18n from 'i18n'
import type { DatahubAPIError } from 'addons/api/types'

export const generateErrorMessage = (error: DatahubAPIError): string => {
  const statusCode =
    error && error.originalError && error.originalError.statusCode

  if (statusCode) {
    const messageKey = getMessageKeyByStatusCode(statusCode)
    return i18n.t(messageKey)
  } else {
    return i18n.t('data:errorsMessage.internalServerErrorMessage')
  }
}

const getMessageKeyByStatusCode = statusCode => {
  const messageKeyConverter = {
    '400': 'data:errorsMessage.badRequestMessage',
    '401': 'data:errorsMessage.tokenErrorMessage',
    '403': 'data:errorsMessage.noAccessAuthErrorMessage',
    '404': 'data:errorsMessage.notExistErrorMessage',
    '409': 'data:errorsMessage.annotationDuplicateName',
    '500': 'data:errorsMessage.internalServerErrorMessage',
    '503': 'data:errorsMessage.serviceUnavailableErrorMessage'
  }
  return messageKeyConverter[statusCode]
}
