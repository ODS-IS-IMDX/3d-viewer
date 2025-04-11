// Copyright (c) 2025 NTT InfraNet
// @flow
import i18n from 'i18n'
import type { DatahubAPIError } from 'addons/api/types'

export const generateErrorMessage = (error: DatahubAPIError): string => {
  const messageCode =
    error && error.originalError && error.originalError.messageCode
  const statusCode =
    error && error.originalError && error.originalError.statusCode

  if (messageCode) {
    const messageKey = getMessageKeyByStatusCode(statusCode)
    return i18n.t(messageKey)
  } else {
    return i18n.t('site:errorsMessage.internalServerErrorMessage')
  }
}

const getMessageKeyByStatusCode = statusCode => {
  const messageKeyConverter = {
    400: 'site:errorsMessage.badRequestMessage',
    401: 'site:errorsMessage.tokenErrorMessage',
    403: 'site:errorsMessage.noAccessAuthErrorMessage',
    404: 'site:errorsMessage.notExistErrorMessage',
    500: 'site:errorsMessage.internalServerErrorMessage',
    503: 'site:errorsMessage.serviceUnavailableErrorMessage'
  }
  return messageKeyConverter[statusCode]
}
