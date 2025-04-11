// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { SiteMobileState } from '../reducer'

const siteMobileStateSelector = (state: RootState): SiteMobileState =>
  state.site.mobile

export const getIsMobile = createSelector(
  siteMobileStateSelector,
  selector => selector.isMobile
)

export const getOpenViewName = createSelector(
  siteMobileStateSelector,
  selector => selector.openViewName
)
