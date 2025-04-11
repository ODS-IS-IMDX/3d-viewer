// Copyright (c) 2025 NTT InfraNet
import createSagaMiddleware from 'redux-saga'
import { createLogger } from 'redux-logger'
import { applyMiddleware, combineReducers, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import { reducers as auth } from './addons/auth'
import { reducers as preventExit } from './addons/preventExit'

import { createBrowserHistory } from 'history'
import { createReduxHistoryContext } from 'redux-first-history'

import config from './config'

export const history = createBrowserHistory()

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer: router
} = createReduxHistoryContext({
  history
})

export const coreReducers = {
  router,
  auth,
  preventExit
}

export const sagaMiddleware = createSagaMiddleware()

const middleware = [sagaMiddleware, routerMiddleware]

if (config.debug) {
  const loggerMiddleWare = createLogger({ collapsed: true })
  middleware.push(loggerMiddleWare)
}

export default createStore(
  combineReducers(coreReducers),
  composeWithDevTools(applyMiddleware(...middleware))
)

export { createReduxHistory }
