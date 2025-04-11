// Copyright (c) 2025 NTT InfraNet
// @flow
import i18n from 'i18n'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

export const generateFingerprint = async () => {
  // Initialize an agent at application startup.
  const fpPromise = FingerprintJS.load()
  // Get the visitor identifier when you need it.
  const fp = await fpPromise
  return (await fp.get()).visitorId
}

export const generateErrorMessage = (
  statusCode: number,
  messageCode: string
) => {
  // statusCode, messageCodeの種類に応じて出し分ける
  let message = ''
  switch (messageCode || statusCode) {
    case 'invalid_license':
      message = i18n.t('auth:errors.invalidLicense')
      break
    // 共通エラー
    case 400:
      message = i18n.t('auth:errors.badRequestMessage')
      break
    case 401:
      message = i18n.t('auth:errors.tokenErrorMessage')
      break
    case 403:
      message = i18n.t('auth:errors.noAccessAuthErrorMessage')
      break
    case 404:
      message = i18n.t('auth:errors.notExistErrorMessage')
      break
    case 500:
      message = i18n.t('auth:errors.internalServerErrorMessage')
      break
    case 503:
      message = i18n.t('auth:errors.serviceUnavailableErrorMessage')
      break
    default:
      message = i18n.t('auth:errors.invalidSignin')
  }

  return message
}
