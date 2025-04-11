// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  ASSET_OPEN_DRAWER,
  ASSET_CLOSE_DRAWER,
  ASSET_ENABLE_DRAWER_BUTTON,
  ASSET_DISABLE_DRAWER_BUTTON,
  type AssetAction
} from 'plugins/asset/actions'

export type AssetMetaState = {
  isDrawerButtonEnabled: boolean,
  isDrawerOpen: boolean
}

const initialState = {
  isDrawerButtonEnabled: true,
  isDrawerOpen: false
}

const metaReducer = (
  state: AssetMetaState = initialState,
  action: AssetAction
) => {
  switch (action.type) {
    case ASSET_OPEN_DRAWER:
      return {
        ...state,
        isDrawerOpen: true
      }
    case ASSET_CLOSE_DRAWER:
      return {
        ...state,
        isDrawerOpen: false
      }
    case ASSET_ENABLE_DRAWER_BUTTON:
      return {
        ...state,
        isDrawerButtonEnabled: true
      }
    case ASSET_DISABLE_DRAWER_BUTTON:
      return {
        ...state,
        isDrawerButtonEnabled: false
      }
    default:
      return state
  }
}

export default metaReducer
