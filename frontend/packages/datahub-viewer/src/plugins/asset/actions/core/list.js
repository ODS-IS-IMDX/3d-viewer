// Copyright (c) 2025 NTT InfraNet
// @flow
import { createLoadListActions } from 'utils/actions'
import type { SiteID } from 'plugins/site/reducer'
import type { Asset } from 'plugins/asset/reducer'
import type { CesiumIonTypes } from 'plugins/asset/types'

// Action types
export const ASSET_LOAD_LIST = 'ASSET_LOAD_LIST'
export const ASSET_LOAD_LIST_SUCCESS = 'ASSET_LOAD_LIST_SUCCESS'
export const ASSET_LOAD_LIST_ERROR = 'ASSET_LOAD_LIST_ERROR'
export const ASSET_UPDATE_LIST = 'ASSET_UPDATE_LIST'
export const ASSET_SET_ASSET_PARAMS = 'ASSET_SET_ASSET_PARAMS'
export const ASSET_FLY_TO_ENTITY = 'ASSET_FLY_TO_ENTITY'
export const ASSET_GET_SELECTED_FROM_LATEST = 'ASSET_GET_SELECTED_FROM_LATEST'
export const ASSET_SET_SELECTED_ITEM = 'ASSET_SET_SELECTED_ITEM'

// Type definitions
export type AssetLoadListAction = {
  type: 'ASSET_LOAD_LIST'
}

export type AssetLoadListSuccessAction = {
  type: 'ASSET_LOAD_LIST_SUCCESS',
  payload: { items: Array<Asset> }
}

export type AssetLoadListErrorAction = {
  type: 'ASSET_LOAD_LIST_ERROR',
  payload: { error: Error }
}

export type AssetUpdateListAction = {
  type: 'ASSET_UPDATE_LIST',
  payload: {
    siteId: SiteID
  }
}

export type AssetSetAssetParamsAction = {
  type: 'ASSET_SET_ASSET_PARAMS',
  payload: {
    isAssetRegistable: boolean
  }
}

export type AssetFlyToEntityAction = {
  type: 'ASSET_FLY_TO_ENTITY',
  payload: {
    param: {
      entityId: string,
      dataSourceName: string,
      ionAssetType: CesiumIonTypes
    }
  }
}

export type AssetGetSelectedFromLatestAction = {
  type: typeof ASSET_GET_SELECTED_FROM_LATEST,
  payload: {
    assetId: string
  }
}

export type AssetSetSelectItemAction = {
  type: typeof ASSET_SET_SELECTED_ITEM,
  payload: {
    selectedAssetItem: any
  }
}

export type AssetListAction =
  | AssetLoadListAction
  | AssetLoadListSuccessAction
  | AssetLoadListErrorAction
  | AssetSetAssetParamsAction
  | AssetUpdateListAction
  | AssetFlyToEntityAction
  | AssetGetSelectedFromLatestAction
  | AssetSetSelectItemAction

// Action creators
export const {
  loadList: loadAssets,
  loadListError: loadAssetsError,
  loadListSuccess: loadAssetsSuccess
} = createLoadListActions(
  ASSET_LOAD_LIST,
  ASSET_LOAD_LIST_ERROR,
  ASSET_LOAD_LIST_SUCCESS
)

export const getSelectedAssetFromLatest = (assetId: string) => {
  return {
    type: ASSET_GET_SELECTED_FROM_LATEST,
    payload: {
      assetId: assetId
    }
  }
}

export const setSelectedAssetItem = (selectedAssetItem: any) => {
  return {
    type: ASSET_SET_SELECTED_ITEM,
    payload: {
      selectedAssetItem: selectedAssetItem
    }
  }
}

export const updateList = (siteId: SiteID) => {
  return {
    type: ASSET_UPDATE_LIST,
    payload: {
      siteId
    }
  }
}

export const setAssetParams = (isAssetRegistable: boolean) => {
  return {
    type: ASSET_SET_ASSET_PARAMS,
    payload: {
      isAssetRegistable
    }
  }
}

export const flyToEntity = (param: {
  entityId: string,
  dataSourceName: string,
  ionAssetType: CesiumIonTypes
}) => {
  return {
    type: ASSET_FLY_TO_ENTITY,
    payload: {
      param
    }
  }
}
