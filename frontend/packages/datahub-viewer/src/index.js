// Copyright (c) 2025 NTT InfraNet
/* eslint-disable */
import 'react-toastify/dist/ReactToastify.min.css'
// import 'polyfills'
import React from 'react'
import ReactDOM from 'react-dom'
import reset from 'styled-reset'
import { I18nextProvider } from 'react-i18next'
import { Provider as ReduxProvider } from 'react-redux'
import { combineReducers } from 'redux'
import { createGlobalStyle, ThemeProvider } from 'styled-components'
import { Provider as PluginsProvider } from '@ehv/react-plugins'
import { theme } from '@ehv/datahub-components'

import type { AssetState } from 'plugins/asset/reducer'
import type { FileState } from 'plugins/file/reducer'
import type { SiteState } from 'plugins/site/reducer'
import type { DataState } from 'plugins/data/reducer'
import store, { coreReducers, sagaMiddleware } from './store'
import i18n from './i18n'
import { initAuth, saga as authSaga } from './addons/auth'
import { initApi } from './addons/api'
import { initPreventExit } from './addons/preventExit'
import plugins from './plugins'
import App from './App'

import { BaseStyle } from './assets/style'
import config from 'config'
import { Ion } from 'cesium'

// types

export type RootState = {
  asset: AssetState,
  file: FileState,
  site: SiteState,
  data: DataState
}

const GlobalStyle = createGlobalStyle`
  ${reset}

  ${BaseStyle}

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  html, body, #root {
    -webkit-overflow-scrolling: auto;
    width: 100vw;
    height: 100vh;
    font-family: 'Source Sans Pro';
    box-sizing: border-box;
  }

  html, body {
    overflow: hidden;
    position: fixed;
  }

  #root {
    overflow: auto;
  }
`

const pluginTasks = {}

const redux = store => ({
  name: 'redux',
  load (plugins, loaded) {
    const reducers = plugins
      .concat(loaded)
      .reduce((reducers, { name, reducer }) => {
        if (reducer) {
          reducers[name] = reducer
        }
        return reducers
      }, {})
    store.replaceReducer(combineReducers({ ...coreReducers, ...reducers }))

    plugins
      .filter(plugin => plugin.saga)
      .forEach(
        plugin => (pluginTasks[plugin.name] = sagaMiddleware.run(plugin.saga))
      )
  },
  unload (plugins, loaded) {
    plugins
      .filter(plugin => plugin.saga)
      .forEach(
        plugin => pluginTasks[plugin.name] && pluginTasks[plugin.name].cancel()
      )

    const reducers = loaded.reduce((reducers, { name, reducer }) => {
      if (reducer) {
        reducers[name] = reducer
      }
      return reducers
    }, {})
    store.replaceReducer(combineReducers({ ...coreReducers, ...reducers }))
  }
})

const i18next = i18n => ({
  name: 'i18next',
  load (plugins) {
    plugins.forEach(plugin => {
      for (const [lang, resources] of Object.entries(plugin.i18n || {})) {
        i18n.addResourceBundle(lang, plugin.name, resources)
      }
    })
  },
  unload (plugins) {
    plugins.forEach(plugin => {
      for (const lang of Object.keys(plugin.i18n || {})) {
        i18n.removeResourceBundle(lang, plugin.name)
      }
    })
  }
})

Ion.defaultAccessToken = ''
Ion.defaultServer = config.cesium.ionServer

async function main () {
  initApi(store)
  await initAuth(store, i18n)

  sagaMiddleware.run(authSaga)
  initPreventExit(store)
  const addons = [i18next(i18n), redux(store)]
  const app = (
    <ThemeProvider theme={theme}>
      <ReduxProvider store={store}>
        <I18nextProvider i18n={i18n}>
          <PluginsProvider
            addons={addons}
            plugins={plugins}
            loaded={['asset', 'file', 'notifications', 'site', 'data']}
          >
            <GlobalStyle />
            <App />
          </PluginsProvider>
        </I18nextProvider>
      </ReduxProvider>
    </ThemeProvider>
  )
  const root = document.getElementById('root')
  root.style.overflow = 'hidden'
  ReactDOM.render(app, root)
}
main().catch(err => {
  console.error(err)
  process.exit(1)
})
