// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  SITE_SET_IS_MOBILE,
  SITE_SET_OPEN_VIEW_NAME,
  type SiteAction
} from '../actions'

export type SiteMobileState = {
  isMobile: boolean,
  openViewName: string | null
}

const initialState = {
  isMobile: false,
  openViewName: null
}

export const mobileReducer = (
  state: SiteMobileState = initialState,
  action: SiteAction
) => {
  switch (action.type) {
    case SITE_SET_IS_MOBILE:
      return {
        ...state,
        isMobile: action.payload.isMobile
      }

    case SITE_SET_OPEN_VIEW_NAME:
      return {
        ...state,
        openViewName: action.payload.openViewName
      }

    default:
      return state
  }
}

export default mobileReducer
