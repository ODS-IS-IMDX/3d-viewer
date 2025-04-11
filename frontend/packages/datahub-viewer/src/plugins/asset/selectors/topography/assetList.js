// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { AssetState, Topography } from 'plugins/asset/reducer'
import { CESIUM_ION_TYPES, assetTypes } from 'plugins/asset/constants'

const assetListStateSelector = (state: RootState): AssetState =>
  state.asset.assetList

export const getTopographyList: RootState => Array<Topography> = createSelector(
  assetListStateSelector,
  asset => {
    return asset.items.filter(
      item => item.category === assetTypes.topography.category
    )
  }
)

export const getTopographyItemCount = createSelector(
  getTopographyList,
  topographyList => topographyList.length
)

export const getVisibleTopographyList = createSelector(
  getTopographyList,
  topographyList => {
    const visibleTopographyList = topographyList.filter(
      topography => topography.isDisplay
    )
    return visibleTopographyList
  }
)
export const getLoadedTopographyList = createSelector(
  getTopographyList,
  topographyList => {
    return topographyList.filter(topography => topography.isLoaded)
  }
)
export const getAvailableTopographyList = createSelector(
  getTopographyList,
  topographyList => {
    return topographyList.filter(topography => topography.isAvailable)
  }
)

export const getBaseTerrainList = createSelector(
  getTopographyList,
  topographyList => {
    return topographyList
      .filter(
        topography => topography.ionAssetType === CESIUM_ION_TYPES.TERRAIN
      )
      .map(topography => {
        return {
          ...topography,
          createdAtTime: Date.parse(topography.createdAt)
        }
      })
      .sort((a, b) => {
        if (a.createdAtTime < b.createdAtTime) {
          return 1
        }
        if (a.createdAtTime > b.createdAtTime) {
          return -1
        }
        return 0
      })
  }
)
