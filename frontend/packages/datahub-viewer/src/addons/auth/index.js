// Copyright (c) 2025 NTT InfraNet
// @flow
import reducers from './reducers'
import saga from './saga'
import auth from './service'

import { AuthLogout } from './components/AuthLogout'
import { ProtectedRoute } from './components/ProtectedRoute'
import AuthRouter from './Router'

import {
  renewError,
  renewSuccess,
  renew,
  signinError,
  signinSuccess,
  setFingerprint,
  AUTH_RENEW_SUCCESS
} from './actions'

import {
  isAuthenticated,
  getAccessToken,
  getFingerprint,
  getLanguage,
  getError
} from './selectors'
import i18nTranslations from './i18n'
// TODO Add a type check for the store
// $FlowFixMe
const initAuth = async (store, i18n) => {
  auth.on('signinSuccess', (...props) =>
    setTimeout(() => store.dispatch(signinSuccess(...props), 0))
  )
  auth.on('signinError', (...props) =>
    setTimeout(() => store.dispatch(signinError(...props), 0))
  )
  auth.on('renew', (...props) => store.dispatch(renew(...props)))
  auth.on('renewSuccess', (...props) =>
    setTimeout(() => store.dispatch(renewSuccess(...props), 0))
  )
  auth.on('renewError', (...props) =>
    setTimeout(() => store.dispatch(renewError(...props), 0))
  )
  auth.on('setFingerprint', (...props) =>
    setTimeout(() => store.dispatch(setFingerprint(...props), 0))
  )
  await auth.init()

  for (const [lang, resources] of Object.entries(i18nTranslations || {})) {
    i18n.addResourceBundle(lang, 'auth', resources)
  }
}

export {
  reducers,
  saga,
  initAuth,
  ProtectedRoute,
  AuthLogout,
  isAuthenticated,
  getAccessToken,
  getFingerprint,
  getLanguage,
  getError,
  AuthRouter,
  auth,
  AUTH_RENEW_SUCCESS
}
