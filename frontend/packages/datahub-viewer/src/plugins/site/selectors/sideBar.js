// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { SiteSideBarState } from '../reducer'

const siteSideBarStateSelector = (state: RootState): SiteSideBarState =>
  state.site.sideBar

// $FlowFixMe
export const getActiveSideBarIconName = createSelector(
  siteSideBarStateSelector,
  selector => selector.activeIconName
)

export const getOpenSideContextMenu = createSelector(
  siteSideBarStateSelector,
  selector => selector.openSideContextMenu
)
