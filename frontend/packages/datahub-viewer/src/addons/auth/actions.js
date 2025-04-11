// Copyright (c) 2025 NTT InfraNet
// @flow

import type { AuthResult, QueryParams } from './service'
import { UserProfile } from './reducers'

export type SigninError = {
  error: any,
  redirect: string
}

export type AuthSignin = {
  originalUri: string
}

export type AuthResetAction = {
  type: 'AUTH_RESET'
}

export type AuthSigninSuccessAction = {
  type: 'AUTH_SIGNIN_SUCCESS',
  payload: AuthResult
}

export type AuthRenewAction = {
  type: 'AUTH_RENEW'
}

export type AuthRenewSuccessAction = {
  type: 'AUTH_RENEW_SUCCESS',
  payload: AuthResult
}

export type AuthRenewErrorAction = {
  type: 'AUTH_RENEW_ERROR',
  payload: SigninError
}

export type AuthSigninErrorAction = {
  type: 'AUTH_SIGNIN_ERROR',
  payload: SigninError
}

export type AuthLogoutAction = {
  type: 'AUTH_LOGOUT'
}

export type AuthRedirectAction = {
  type: 'AUTH_REDIRECT'
}

export type AuthLoadUserProfileSuccessAction = {
  type: 'AUTH_LOAD_USERPROFILE_SUCCESS',
  payload: UserProfile
}

export type AuthResetAuthStateAction = {
  type: 'AUTH_RESET_AUTH_STATE'
}

export type AuthSetAccountValid = {
  type: 'AUTH_SET_ACCOUNT_VALID',
  payload: {
    isValid: boolean
  }
}

export type AuthSetFingerPrint = {
  type: 'AUTH_SET_FINGERPRINT',
  payload: {
    fingerprint: string
  }
}

export type AuthSetCheckedLicenceAction = {
  type: 'AUTH_SET_CHECKED_LICENCE',
  payload: {
    isCheckedLicence: boolean
  }
}

export type AuthActions =
  | AuthResetAction
  | AuthSigninSuccessAction
  | AuthRenewSuccessAction
  | AuthRenewErrorAction
  | AuthSigninErrorAction
  | AuthLogoutAction
  | AuthRedirectAction
  | AuthLoadUserProfileSuccessAction
  | AuthResetAuthStateAction
  | AuthSetAccountValid
  | AuthSetFingerPrint
  | AuthSetCheckedLicenceAction

export const AUTH_RESET = 'AUTH_RESET'
export const AUTH_SIGNIN = 'AUTH_SIGNIN'
export const AUTH_HANDLE_AUTHENTICATION = 'AUTH_HANDLE_AUTHENTICATION'
export const AUTH_HANDLE_RENEW = 'AUTH_HANDLE_RENEW'
export const AUTH_SIGNIN_SUCCESS = 'AUTH_SIGNIN_SUCCESS'
export const AUTH_SIGNIN_ERROR = 'AUTH_SIGNIN_ERROR'
export const AUTH_RENEW = 'AUTH_RENEW'
export const AUTH_RENEW_SUCCESS = 'AUTH_RENEW_SUCCESS'
export const AUTH_RENEW_ERROR = 'AUTH_RENEW_ERROR'
export const AUTH_LOGOUT = 'AUTH_LOGOUT'
export const AUTH_REDIRECT = 'AUTH_REDIRECT'
export const AUTH_LOAD_USERPROFILE_SUCCESS = 'AUTH_LOAD_USERPROFILE_SUCCESS'
export const AUTH_RESET_AUTH_STATE = 'AUTH_RESET_AUTH_STATE'
export const AUTH_SET_ACCOUNT_VALID = 'AUTH_SET_ACCOUNT_VALID'
export const AUTH_SET_FINGERPRINT = 'AUTH_SET_FINGERPRINT'
export const AUTH_SET_CHECKED_LICENCE = 'AUTH_SET_CHECKED_LICENCE'

export const signin = (params: AuthSignin) => ({
  type: AUTH_SIGNIN,
  payload: params
})

export const reset = () => ({
  type: AUTH_RESET
})

export const logout = () => ({
  type: AUTH_LOGOUT
})

export const handleAuthentication = (queryParams: QueryParams) => ({
  type: AUTH_HANDLE_AUTHENTICATION,
  payload: queryParams
})

export const signinSuccess = (authResult: AuthResult) => ({
  type: AUTH_SIGNIN_SUCCESS,
  payload: authResult
})

export const renew = () => ({
  type: AUTH_RENEW
})

export const handleRenew = (queryParams: QueryParams) => ({
  type: AUTH_HANDLE_RENEW,
  payload: queryParams
})

export const renewSuccess = (authResult: AuthResult) => ({
  type: AUTH_RENEW_SUCCESS,
  payload: authResult
})

export const signinError = (props: SigninError) => ({
  type: AUTH_SIGNIN_ERROR,
  payload: props
})

export const renewError = (props: SigninError) => ({
  type: AUTH_RENEW_ERROR,
  payload: props
})

export const redirect = () => ({
  type: AUTH_REDIRECT
})

export const loadUserProfileSuccess = (userProfile: UserProfile) => ({
  type: AUTH_LOAD_USERPROFILE_SUCCESS,
  payload: userProfile
})

export const resetAuthState = () => ({
  type: AUTH_RESET_AUTH_STATE
})

export const setAccountValid = (isValid: boolean) => ({
  type: AUTH_SET_ACCOUNT_VALID,
  payload: {
    isValid
  }
})

export const setFingerprint = (fingerprint: string) => ({
  type: AUTH_SET_FINGERPRINT,
  payload: {
    fingerprint
  }
})

export const setCheckedLicence = (
  isCheckedLicence: boolean
): AuthSetCheckedLicenceAction => ({
  type: AUTH_SET_CHECKED_LICENCE,
  payload: {
    isCheckedLicence
  }
})
