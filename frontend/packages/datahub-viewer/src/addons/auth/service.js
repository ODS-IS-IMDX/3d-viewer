// Copyright (c) 2025 NTT InfraNet
// @flow
import jwtDecode from 'jwt-decode'
import Cookies from 'js-cookie'
import type { UserProfile } from './reducers'
import EventEmitter from 'events'
import config from '../../config'
import { api } from '../api'
import webSocketService from 'plugins/notifications/service'

export type QueryParams = {
  redirect?: string,
  code?: string,
  state?: string
}

export type AuthResult = {
  accessToken?: ?string,
  refreshToken: ?string,
  idToken?: ?string,
  isAuthenticated?: boolean,
  expiresIn?: number,
  expiresAt?: number,
  userProfile?: UserProfile,
  redirect?: ?string,
  shouldChangePassword?: ?boolean
}

export type UserMetadata = {
  lastSiteLoaded: {
    siteId: string
  }
}

// The token expire is 7200
export const RENEW_BEFORE_EXPIRE_IN_MILLISECONDS = 20 * 1000
export const COOKIE_EXPIRE_DAY = 1
// NOTE: 3DVではinitしか使わない想定だが、ほかの関数を削除してしまうとソース全体に影響が出るため、そのまま残す
class AuthService extends EventEmitter {
  expiresAt: ?number = null
  tokenRenewalTimeout = null
  authResult: ?AuthResult = null

  init = async () => {
    this.emit('signinSuccess', { expiresAt: 0 })
  }

  handleRenew = async (queryParams: QueryParams) => {
    if (Cookies.get('isLoggedIn')) {
      this.authResult = {
        refreshToken: Cookies.get('dhAuthRefreshToken')
      }
      await this.renewSession(true, {
        redirect: JSON.parse(String(queryParams.state)).redirect
      })
    }
  }

  handleAuthentication = async (queryParams: QueryParams) => {
    const { baseUrl } = config
    let tmpAuthResult
    try {
      const options = {
        body: {
          grantType: 'authorization_code',
          code: queryParams.code,
          redirectUri: `${baseUrl}/auth/callback`
        }
      }
      const result = await api.connectToken(options)

      tmpAuthResult = {
        accessToken: result.auth.access_token,
        refreshToken: result.auth.refresh_token,
        idToken: result.auth.id_token,
        expiresIn: result.auth.expires_in,
        scope: result.auth.scope,
        tokenType: result.auth.token_type
      }
      if (tmpAuthResult.accessToken) {
        const jwt = jwtDecode(tmpAuthResult.accessToken)

        tmpAuthResult.expiresAt =
          jwt.exp * 1000 - RENEW_BEFORE_EXPIRE_IN_MILLISECONDS
        this.expiresAt = tmpAuthResult.expiresAt

        this.setSession(tmpAuthResult)
        tmpAuthResult.redirect = JSON.parse(
          queryParams.state || { redirect: '/' }
        ).redirect
        this.scheduleRenewal()
        this.emit('signinSuccess', tmpAuthResult)
      } else {
        throw new Error('AccessToken not available')
      }
    } catch (e) {
      Cookies.remove('isLoggedIn')
      Cookies.remove('dhAuthRefreshToken')
      sessionStorage.removeItem('authData')
      this.emit('signinError', {
        error: new Error(e.message),
        redirect: `/`
      })
    }
  }

  setSession = (authResult: AuthResult) => {
    Cookies.set('isLoggedIn', 'true', { expires: COOKIE_EXPIRE_DAY })
    Cookies.set('dhAuthRefreshToken', authResult.refreshToken, {
      expires: COOKIE_EXPIRE_DAY
    })
    this.authResult = authResult
    sessionStorage.setItem('authData', JSON.stringify(authResult))
  }

  renewSession = async (skipStorage: ?boolean, queryParams: QueryParams) => {
    if (this.tokenRenewalTimeout && this.tokenRenewalTimeout > 0) {
      this.reset()
    }

    this.emit('renew')
    if (!skipStorage) {
      const result = sessionStorage.getItem('authData')
      if (result) {
        const tmpAuthResult = JSON.parse(result)
        const jwt = jwtDecode(tmpAuthResult.accessToken)
        tmpAuthResult.expiresAt =
          jwt.exp * 1000 - RENEW_BEFORE_EXPIRE_IN_MILLISECONDS
        this.expiresAt = tmpAuthResult.expiresAt
        this.setSession(tmpAuthResult)
      }
    }

    if (!this.authResult || !this.authResult.refreshToken) {
      this.emit('renewError', {
        error: 'Auth data not available',
        redirect: '/'
      })
      return
    }

    try {
      const options = {
        body: {
          grantType: 'refresh_token',
          refreshToken: this.authResult.refreshToken
        }
      }
      const result = await api.connectToken(options)
      const tmpAuthResult = {
        accessToken: result.auth.access_token,
        refreshToken: this.authResult.refreshToken,
        idToken: this.authResult.idToken,
        expiresIn: result.auth.expires_in,
        scope: result.auth.scope,
        tokenType: result.auth.token_type,
        redirect: undefined
      }

      if (tmpAuthResult && tmpAuthResult.accessToken) {
        const jwt = jwtDecode(tmpAuthResult.accessToken)
        tmpAuthResult.expiresAt =
          jwt.exp * 1000 - RENEW_BEFORE_EXPIRE_IN_MILLISECONDS
        this.expiresAt = tmpAuthResult.expiresAt
        if (queryParams && queryParams.redirect) {
          tmpAuthResult.redirect = queryParams.redirect
        }
        this.setSession(tmpAuthResult)
        this.scheduleRenewal()
        this.emit('renewSuccess', tmpAuthResult)
      } else {
        throw new Error('AccessToken not available')
      }
    } catch (e) {
      this.emit('renewError', {
        error: new Error(e.message),
        redirect: '/'
      })
      this.logout()
    }
  }

  reset = () => {
    this.expiresAt = 0
    Cookies.remove('isLoggedIn')
    Cookies.remove('dhAuthRefreshToken')
    sessionStorage.removeItem('authData')

    clearTimeout(this.tokenRenewalTimeout)
  }

  logout = (redirect: string = '/') => {
    this.reset()
    // window.location = redirect;
  }

  scheduleRenewal = () => {
    let expiresAt: ?number = this.expiresAt
    const timeout = Number(expiresAt) - Date.now() - 10000
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession(true, {})

        // Websocketの接続維持のためのメッセージ送信
        const userId = this.getUserMetadata().user
        const data = { userId: userId }
        webSocketService.sendMessage(data)
      }, timeout)
    }
  }

  getUserMetadata = () => {
    const userMetadata = sessionStorage.getItem('userMetadata')

    if (!this.authResult) {
      return {}
    }
    if (!userMetadata) {
      return {}
    } else {
      try {
        const result = JSON.parse(userMetadata)
        const decodedToken = jwtDecode(this.authResult.accessToken)
        if (result.user === decodedToken.sub) {
          return result
        }
        return {}
      } catch {
        return {}
      }
    }
  }

  setUserMetadata = (metadata: UserMetadata) => {
    if (this.authResult) {
      const decodedToken = jwtDecode(this.authResult.accessToken)
      sessionStorage.setItem(
        'userMetadata',
        JSON.stringify({ ...metadata, user: decodedToken.sub })
      )
    }
  }
}

export default new AuthService()
