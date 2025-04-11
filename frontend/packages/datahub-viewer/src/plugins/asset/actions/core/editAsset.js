// Copyright (c) 2025 NTT InfraNet
// @flow
import type { AssetID, AssetEditingData } from 'plugins/asset/reducer'

// Type definitions
export type AssetEditAction = {
  type: 'ASSET_EDIT',
  payload: {
    param: AssetEditingData
  }
}

export type AssetInitEditingDataAction = {
  type: 'ASSET_INIT_EDITING_DATA',
  payload: {
    asset: AssetEditingData
  }
}

export type AssetSetAssetDataAction = {
  type: 'ASSET_SET_ASSET_DATA',
  payload: {
    assetId: AssetID,
    subFileType: number,
    name: string
  }
}

export type AssetSetTransformEditorAction = {
  type: 'ASSET_SET_TRANSFORM_EDITOR',
  payload: {
    originModelMatrix: any,
    transformEditor: any,
    modelMatrix: any,
    rootTransform: any
  }
}

export type AssetUpdateEditingDataAction = {
  type: 'ASSET_UPDATE_EDITING_DATA',
  payload: AssetEditingData
}

export type AssetCancelEditAssetAction = {
  type: 'ASSET_CANCEL_EDIT_ASSET'
}

export type AssetClearEditAssetAction = {
  type: 'ASSET_CLEAR_EDIT_ASSET'
}

// Action types
export const ASSET_EDIT = 'ASSET_EDIT'
export const ASSET_INIT_EDITING_DATA = 'ASSET_INIT_EDITING_DATA'
export const ASSET_SET_ASSET_DATA = 'ASSET_SET_ASSET_DATA'
export const ASSET_SET_TRANSFORM_EDITOR = 'ASSET_SET_TRANSFORM_EDITOR'
export const ASSET_UPDATE_EDITING_DATA = 'ASSET_UPDATE_EDITING_DATA'
export const ASSET_RESET_EDIT_TRANSFORM = 'ASSET_RESET_EDIT_TRANSFORM'
export const ASSET_CANCEL_EDIT_ASSET = 'ASSET_CANCEL_EDIT_ASSET'
export const ASSET_CLEAR_EDIT_ASSET = 'ASSET_CLEAR_EDIT_ASSET'

// Action creators
export const editAsset = (param: AssetEditAction.payload) => ({
  type: ASSET_EDIT,
  payload: { param }
})

export const initEditingData = (asset: AssetEditingData) => {
  return {
    type: ASSET_INIT_EDITING_DATA,
    payload: {
      asset
    }
  }
}

export const setAssetData = ({ assetId, subFileType, name }) => {
  return {
    type: ASSET_SET_ASSET_DATA,
    payload: {
      assetId,
      subFileType,
      name
    }
  }
}

export const setTransformEditor = ({
  originModelMatrix,
  transformEditor,
  modelMatrix,
  rootTransform
}) => {
  return {
    type: ASSET_SET_TRANSFORM_EDITOR,
    payload: {
      originModelMatrix,
      transformEditor,
      modelMatrix,
      rootTransform
    }
  }
}

export const updateEditingData = ({
  displayName,
  coordinates,
  startDateTime,
  endDateTime
}: AssetEditingData) => {
  return {
    type: ASSET_UPDATE_EDITING_DATA,
    payload: {
      displayName,
      coordinates,
      startDateTime,
      endDateTime
    }
  }
}

export const cancelEditAsset = () => {
  return {
    type: ASSET_CANCEL_EDIT_ASSET
  }
}

export const clearEditAsset = () => {
  return {
    type: ASSET_CLEAR_EDIT_ASSET
  }
}
