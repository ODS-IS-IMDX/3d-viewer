// Copyright (c) 2025 NTT InfraNet
// @flow
import type { PreventExitActions } from './actions'

import { PREVENT_EXIT_ADD, PREVENT_EXIT_REMOVE } from './actions'

export type PreventExitState = {
  keys: Array<string>
}

const initialState: PreventExitState = {
  keys: []
}

function reducers (
  state: PreventExitState = initialState,
  action: PreventExitActions
) {
  switch (action.type) {
    case PREVENT_EXIT_ADD:
      return {
        ...state,
        keys: [...state.keys, action.payload.key]
      }
    case PREVENT_EXIT_REMOVE:
      return {
        ...state,
        keys: state.keys.filter(key => key !== action.payload.key)
      }
    default:
      return state
  }
}

export default reducers
