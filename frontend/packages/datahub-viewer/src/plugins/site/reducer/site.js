// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  SITE_SET_IS_OPEN_VIEWER,
  SITE_SET_IS_MAP_SETTING,
  type SiteAction
} from '../actions'

export type SiteState = {
  open: boolean,
  isMapSetting: boolean
}

const initialState: SiteState = {
  open: false,
  isMapSetting: false
}

const siteReducer = (
  state: SiteState = initialState,
  action: SiteAction
): SiteState => {
  switch (action.type) {
    case SITE_SET_IS_OPEN_VIEWER:
      return {
        ...state,
        open: action.payload
      }
    case SITE_SET_IS_MAP_SETTING:
      return {
        ...state,
        isMapSetting: !state.isMapSetting
      }
    default:
      return state
  }
}

export default siteReducer
