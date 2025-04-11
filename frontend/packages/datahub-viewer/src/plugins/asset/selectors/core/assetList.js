// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { AssetListState } from '../../reducer'

const assetAssetListStateSelector = (state: RootState): AssetListState =>
  state.asset.assetList

// $FlowFixMe
export const getAssetList = createSelector(
  assetAssetListStateSelector,
  list => list.items
)

// $FlowFixMe
export const getAssetItemCount = createSelector(
  getAssetList,
  assetList => assetList.length
)

// $FlowFixMe
export const isLoading = createSelector(
  assetAssetListStateSelector,
  assetList => assetList.isLoading
)

// $FlowFixMe
export const isError = createSelector(
  assetAssetListStateSelector,
  assetList => assetList.isError
)

// $FlowFixMe
export const isRendering = createSelector(
  assetAssetListStateSelector,
  assetList => assetList.isRenderingStatus
)

// $FlowFixMe
export const isAssetRegistable = createSelector(
  assetAssetListStateSelector,
  assetList => assetList.isAssetRegistable
)

// $FlowFixMe
export const getVisibleAssetList = createSelector(
  assetAssetListStateSelector,
  list =>
    list && Array.isArray(list.items)
      ? list.items.filter(item => item.isDisplay)
      : []
)

// $FlowFixMe
export const getSelectedAssetItem = createSelector(
  assetAssetListStateSelector,
  assetList => assetList.selectedAssetItem
)
