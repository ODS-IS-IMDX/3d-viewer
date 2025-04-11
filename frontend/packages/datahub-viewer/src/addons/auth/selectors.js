// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { AuthState, UserProfile } from './reducers'

type RootState = {
  auth: AuthState
}

const authStateSelector = (state: RootState): AuthState => state.auth

export const isAuthenticated = (state: RootState): boolean => {
  // if (state.auth.shouldChangePassword) {
  //   return false
  // }
  return state.auth.isAuthenticated
}

export const getAccessToken: RootState => ?string = createSelector(
  authStateSelector,
  // (state: AuthState) => state.idToken
  (state: AuthState) => state.accessToken
)

export const getLanguage: RootState => ?string = createSelector(
  authStateSelector,
  (state: AuthState) => (state.userProfile ? state.userProfile.language : null)
)

export const isRenewing: RootState => boolean = createSelector(
  authStateSelector,
  (state: AuthState) => state.isRenewing
)

export const getError: RootState => ?string = createSelector(
  authStateSelector,
  state => state.error
)

export const isAccountValid = createSelector(
  authStateSelector,
  state => state.isAccountValid
)

export const getUserProfile: RootState => ?UserProfile = createSelector(
  authStateSelector,
  state => state.userProfile || {}
)

export const getFingerprint: RootState => ?string = createSelector(
  authStateSelector,
  (state: AuthState) => state.fingerprint
)

export const getCheckedLicence: RootState => boolean = createSelector(
  authStateSelector,
  selector => selector.isCheckedLicence
)
