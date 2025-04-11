// Copyright (c) 2025 NTT InfraNet
import { COMPONENTS_INJECT, COMPONENTS_REMOVE } from '../actions/components'

const initialState = {
  slots: {}
}

function components (state = initialState, action) {
  switch (action.type) {
    case COMPONENTS_INJECT:
      return {
        ...state,
        slots: {
          ...state.slots,
          [action.slot]: [...(state[action.slot] || []), action.component]
        }
      }
    case COMPONENTS_REMOVE:
      return {
        ...state,
        slots: {
          ...state.slots,
          [action.slot]: undefined
        }
      }
    default:
      return state
  }
}

export default components
