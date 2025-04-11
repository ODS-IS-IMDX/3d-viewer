// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  DATA_CHANGE_MENU_MODE,
  DATA_OPEN_DRAWER,
  DATA_CLOSE_DRAWER,
  type DataMetaAction
} from '../actions'
import { MENU_MODE } from '../constants'

export type DataMetaState = {
  menuMode: string,
  isDrawerOpen: boolean
}

const initialState = {
  menuMode: MENU_MODE.SHOW,
  isDrawerOpen: false
}

export const metaReducer = (
  state: DataMetaState = initialState,
  action: DataMetaAction
): DataMetaState => {
  switch (action.type) {
    case DATA_CHANGE_MENU_MODE: {
      const menuMode =
        action.payload && action.payload.menuMode
          ? action.payload.menuMode
          : MENU_MODE.SHOW
      return {
        ...state,
        menuMode
      }
    }
    case DATA_OPEN_DRAWER:
      return {
        ...state,
        isDrawerOpen: true
      }
    case DATA_CLOSE_DRAWER:
      return {
        ...state,
        isDrawerOpen: false
      }
    default:
      return state
  }
}
