// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  SITE_SET_OPEN_SIDE_CONTEXT_MENU,
  SITE_SET_ACTIVE_SIDE_BAR_ICON_NAME,
  type SiteAction
} from '../actions'

export type SiteSideBarState = {
  activeIconName: string | null,
  openSideContextMenu: {
    close: (() => void) | null
  }
}

const initialState = {
  activeIconName: null,
  openSideContextMenu: { close: null }
}

export const sideBarReducer = (
  state: SiteSideBarState = initialState,
  action: SiteAction
) => {
  switch (action.type) {
    case SITE_SET_ACTIVE_SIDE_BAR_ICON_NAME:
      return {
        ...state,
        activeIconName: action.payload.iconName
      }
    case SITE_SET_OPEN_SIDE_CONTEXT_MENU:
      return {
        ...state,
        openSideContextMenu: {
          close: action.payload.close
        }
      }
    default:
      return state
  }
}
