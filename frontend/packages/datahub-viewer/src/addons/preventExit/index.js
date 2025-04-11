// Copyright (c) 2025 NTT InfraNet
// @flow
import reducers from './reducers'
import { preventExitAdd, preventExitRemove } from './actions'
import { shouldPreventExit } from './selectors'

// $FlowFixMe
const initPreventExit = store => {
  window.addEventListener('beforeunload', e => {
    if (shouldPreventExit(store.getState())) {
      e.returnValue = true
      return true
    }
  })
}

export { reducers, preventExitRemove, preventExitAdd, initPreventExit }
