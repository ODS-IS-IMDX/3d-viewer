// Copyright (c) 2025 NTT InfraNet
// @flow
import type { AuthActions } from './actions'

import {
  AUTH_RESET,
  AUTH_RENEW,
  AUTH_RENEW_ERROR,
  AUTH_RENEW_SUCCESS,
  AUTH_SIGNIN_ERROR,
  AUTH_SIGNIN_SUCCESS,
  AUTH_RESET_AUTH_STATE,
  AUTH_SET_ACCOUNT_VALID,
  AUTH_LOAD_USERPROFILE_SUCCESS,
  AUTH_SET_FINGERPRINT,
  AUTH_SET_CHECKED_LICENCE
} from './actions'

export type UserProfile = {
  language?: string,
  firstName?: string,
  lastName?: string,
  email?: string,
  site?: {
    id: string,
    name: string
  },
  licenseType?: string,
  licenseOptions?: any
}

export type AuthState = {
  isRenewing: boolean,
  isAccountValid: boolean,
  isAuthenticated: boolean,
  isCheckedLicence: boolean,
  shouldChangePassword: boolean,
  accessToken: ?string,
  fingerprint: ?string,
  idToken: ?string,
  expiresAt: number | null,
  userProfile: ?UserProfile,
  error: ?string
}

const initialState: AuthState = {
  shouldChangePassword: false,
  isRenewing: false,
  isAuthenticated: false,
  isCheckedLicence: false,
  accessToken: null,
  fingerprint: null,
  idToken: null,
  expiresAt: null,
  userProfile: null,
  error: null,
  isAccountValid: false
}

function reducers (state: AuthState = initialState, action: AuthActions) {
  switch (action.type) {
    case AUTH_RESET:
      return {
        ...initialState
      }
    case AUTH_RENEW:
      return {
        ...state,
        isRenewing: true
      }
    case AUTH_SIGNIN_SUCCESS:
    case AUTH_RENEW_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        accessToken: action.payload.accessToken,
        idToken: action.payload.idToken,
        expiresAt: action.payload.expiresAt,
        error: null,
        isRenewing: false,
        isAccountValid: true
      }
    case AUTH_RENEW_ERROR:
    case AUTH_SIGNIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        accessToken: null,
        idToken: null,
        expiresAt: null,
        userProfile: null,
        error: action.payload.error,
        isRenewing: false,
        isAccountValid: false
      }
    case AUTH_LOAD_USERPROFILE_SUCCESS:
      return {
        ...state,
        userProfile: {
          language: action.payload.language || '',
          firstName: action.payload.given_name || '',
          lastName: action.payload.family_name || '',
          email: action.payload.email || '',
          site: action.payload.site || null,
          licenseType: action.payload.licenseType || '',
          licenseOptions: action.payload.licenseOptions || ''
        }
      }
    case AUTH_RESET_AUTH_STATE:
      return {
        ...state,
        accessToken: null,
        error: null,
        expiresAt: null,
        idToken: null,
        isAuthenticated: false,
        isRenewing: false,
        shouldChangePassword: false,
        userProfile: null,
        isAccountValid: true
      }
    case AUTH_SET_ACCOUNT_VALID:
      return {
        ...state,
        isAccountValid: action.payload.isValid
      }
    case AUTH_SET_FINGERPRINT:
      return {
        ...state,
        fingerprint: action.payload.fingerprint
      }
    case AUTH_SET_CHECKED_LICENCE:
      return {
        ...state,
        isCheckedLicence: action.payload.isCheckedLicence
      }
    default:
      return state
  }
}

export default reducers
