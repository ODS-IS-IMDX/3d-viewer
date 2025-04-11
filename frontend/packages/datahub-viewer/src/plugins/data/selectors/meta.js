// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { DataMetaState } from '../reducer/meta'

const dataMetaStateSelector = (state: RootState): DataMetaState =>
  state.data.meta

// $FlowFixMe
export const getMenuMode = createSelector(
  dataMetaStateSelector,
  selector => selector.menuMode
)
// $FlowFixMe
export const getIsDrawerOpen = createSelector(dataMetaStateSelector, selector =>
  selector ? selector.isDrawerOpen : false
)
