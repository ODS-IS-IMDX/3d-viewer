// Copyright (c) 2025 NTT InfraNet
// @flow
import _get from 'lodash/get'
import { replace } from 'redux-first-history'
import {
  takeEvery,
  call,
  put,
  select,
  race,
  take,
  fork
} from 'redux-saga/effects'
import type { Site } from 'plugins/site/reducer'
import type { Saga } from 'redux-saga'
import { notifyError } from 'plugins/notifications/actions'
import { SITE_LOAD_SELECTED_SUCCESS } from 'plugins/site/actions'
import { unwrap } from 'utils/saga'
import { api } from '../../addons/api'
import { matchPath } from 'react-router'
import auth from './service'
import i18n from '../../i18n'
import {
  isAuthenticated as isAuthenticatedSelector,
  isRenewing as isRenewingSelector
} from './selectors'
import {
  AUTH_LOGOUT,
  AUTH_RENEW_ERROR,
  AUTH_SIGNIN_SUCCESS,
  AUTH_HANDLE_AUTHENTICATION,
  AUTH_HANDLE_RENEW,
  AUTH_RENEW_SUCCESS,
  loadUserProfileSuccess,
  AuthActions,
  SigninError
} from './actions'
import { generateErrorMessage } from './utils'

export function * logout () {
  yield call(auth.logout)
}

export function * handleAuthentication (action: AuthActions) {
  yield call(auth.handleAuthentication, action.payload)
}

// ユーザー情報取得
export function * initUserSettings (): Saga<void> {
  try {
    const { user } = yield call(api.getUserProfile)
    yield put(loadUserProfileSuccess(user))

    const currentLocation = window.location
    const currentParams = new URLSearchParams(currentLocation.search)
    // NOTE: 管理者（9999999999999-）かつクエリーパラメータに正しい（/site/始まり）redirectがある場合、リダイレクト
    const isAdministrator = user.corporation.id.startsWith('9999999999999-')
    if (
      isAdministrator &&
      currentParams.get('redirect')?.startsWith('/site/')
    ) {
      yield put(replace(currentParams.get('redirect')))
      return
    }
    // NOTE: 一般ユーザーもしくは管理者で正しいクエリパラメータを持たない場合は、自身のsiteIdにリダイレクト
    const match = matchPath(currentLocation.pathname, {
      path: '/site/:siteId',
      exact: true,
      strict: false
    })
    if (!match) {
      yield put(replace(`/site/${user.site.id}`))
    }
  } catch (error) {
    // statuscode messagecodeで出し分け
    const statusCode =
      error && error.originalError && error.originalError.statusCode
    const messageCode =
      error && error.originalError && error.originalError.messageCode
    const errorMessage = generateErrorMessage(statusCode, messageCode)
    yield put(notifyError(errorMessage))
  }
}

export function * signinError (props: SigninError) {
  yield put(notifyError(i18n.t('auth:errors.invalidSignin')))
  // yield put(replace(props.payload.redirect || "/"));
}

export function * handleRenew (action: AuthActions) {
  yield call(auth.handleRenew, action.payload)
}

export function * renewError (props: SigninError) {
  yield put(notifyError(i18n.t('auth:errors.invalidRenew')))
  yield put(replace(props.payload.redirect || '/'))
}

export function * saveLastSiteLoaded (site: Site) {
  yield call(auth.setUserMetadata, {
    lastSiteLoaded: {
      siteId: _get(site, 'data.id')
    }
  })
}

export function * watchFirstAuthSuccess () {
  const authAction = yield take([AUTH_SIGNIN_SUCCESS, AUTH_RENEW_SUCCESS])
  yield initUserSettings(authAction)
}

export default function * saga () {
  yield fork(watchFirstAuthSuccess)
  yield takeEvery(AUTH_HANDLE_RENEW, handleRenew)
  yield takeEvery(AUTH_LOGOUT, logout)
  yield takeEvery(AUTH_HANDLE_AUTHENTICATION, handleAuthentication)
  yield takeEvery(SITE_LOAD_SELECTED_SUCCESS, unwrap(saveLastSiteLoaded))
}

export function execSagaIfAuthenticated (sagaToExec) {
  return function * (params) {
    const isAuthenticated = yield select(isAuthenticatedSelector)
    const isRenewing = yield select(isRenewingSelector)
    if (!isAuthenticated && !isRenewing) {
      return
    }

    if (isRenewing) {
      const { error } = yield race({
        success: take(AUTH_RENEW_SUCCESS),
        error: take(AUTH_RENEW_ERROR)
      })
      if (error) {
        return
      }
    }

    yield sagaToExec(params)
  }
}
