// Copyright (c) 2025 NTT InfraNet
// @flow
import DatahubApi from 'addons/api/api.js'
import config from '../../config'

let api

// TODO Add a type check for the store
// $FlowFixMe
const initApi = store => {
  api = new DatahubApi({
    domain: config.datahubServerUrl,
    getAccessToken: () => null,
    // NOTE: 認証エラーの時はページリロードを行い、ログイン画面に遷移させる
    onUnauthorizedRequest: () => window.location.reload()
  })
}

const getApi = () => api

export { initApi, getApi, api }
