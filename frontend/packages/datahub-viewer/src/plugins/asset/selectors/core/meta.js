// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { AssetMetaState } from '../../reducer'

const assetMetaStateSelector = (state: RootState): AssetMetaState =>
  state.asset.meta

// $FlowFixMe
export const isDrawerOpen = createSelector(
  assetMetaStateSelector,
  meta => meta.isDrawerOpen
)

// $FlowFixMe
export const getDrawerButtonEnabled = createSelector(
  assetMetaStateSelector,
  selector => selector.isDrawerButtonEnabled
)
