// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { AssetState, Designfile } from 'plugins/asset/reducer'
import { assetTypes } from 'plugins/asset/constants'

const assetListStateSelector = (state: RootState): AssetState =>
  state.asset.assetList

export const getDesignfileList: RootState => Array<Designfile> = createSelector(
  assetListStateSelector,
  asset => {
    return asset.items.filter(
      item => item.category === assetTypes.designFile.category
    )
  }
)

export const getDesignfileItemCount = createSelector(
  getDesignfileList,
  designfileList => designfileList.length
)

export const getVisibleDesignfileList = createSelector(
  getDesignfileList,
  designfileList => {
    const visibleDesignfileList = designfileList.filter(
      designfile => designfile.isDisplay
    )
    return visibleDesignfileList
  }
)

export const getLoadedDesignfileList = createSelector(
  getDesignfileList,
  designfileList => {
    return designfileList.filter(designfile => designfile.isLoaded)
  }
)
export const getAvailableDesignfileList = createSelector(
  getDesignfileList,
  designfileList => {
    return designfileList.filter(designfile => designfile.isAvailable)
  }
)
