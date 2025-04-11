// Copyright (c) 2025 NTT InfraNet
// @flow
import type { AssetID } from 'plugins/asset/reducer'

// Type definitions
export type AssetSetAssetRenderingAction = {
  type: 'ASSET_SET_ASSET_RENDERING',
  payload: {
    id: AssetID,
    isRendering: boolean
  }
}
export type AssetSetAvailableAction = {
  type: 'ASSET_SET_ASSET_AVAILABLE',
  payload: {
    id: AssetID,
    isAvailable: boolean
  }
}
export type AssetSetStyleAction = {
  type: 'ASSET_SET_ASSET_STYLE',
  payload: {
    id: AssetID,
    style: {
      color: string,
      transparency: number,
      filter: any
    }
  }
}
export type AssetResetStyleAction = {
  type: 'ASSET_RESET_ASSET_STYLE',
  payload: {
    id: AssetID
  }
}
export type AssetSetIsTransparencyAction = {
  type: 'ASSET_SET_ASSET_IS_TRANSPARENCY',
  payload: {
    id: AssetID,
    isTransparency: boolean
  }
}
export type AssetRenderAction =
  | AssetSetAssetRenderingAction
  | AssetSetAvailableAction
  | AssetSetStyleAction
  | AssetResetStyleAction
  | AssetSetIsTransparencyAction

// Action types
export const ASSET_SET_ASSET_RENDERING = 'ASSET_SET_ASSET_RENDERING'
export const ASSET_SET_ASSET_AVAILABLE = 'ASSET_SET_ASSET_AVAILABLE'
export const ASSET_SET_ASSET_STYLE = 'ASSET_SET_ASSET_STYLE'
export const ASSET_RESET_ASSET_STYLE = 'ASSET_RESET_ASSET_STYLE'
export const ASSET_SET_ASSET_IS_TRANSPARENCY = 'ASSET_SET_ASSET_IS_TRANSPARENCY'

// Action creators
export const setAssetRenderingState = (id: AssetID, isRendering: boolean) => {
  return {
    type: ASSET_SET_ASSET_RENDERING,
    payload: {
      id,
      isRendering
    }
  }
}

export const setAssetAvailable = (id: AssetID, isAvailable: boolean) => {
  return {
    type: ASSET_SET_ASSET_AVAILABLE,
    payload: {
      id,
      isAvailable
    }
  }
}

export const setAssetStyle = (
  id: AssetID,
  style: {
    color: string,
    transparency: number,
    filter: any,
    textureBrightness: number,
    modelBrightness: number
  }
) => {
  return {
    type: ASSET_SET_ASSET_STYLE,
    payload: {
      id,
      style
    }
  }
}
export const resetAssetStyle = (id: AssetID) => {
  return {
    type: ASSET_RESET_ASSET_STYLE,
    payload: {
      id
    }
  }
}
export const setAssetIsTransparency = (
  id: AssetID,
  isTransparency: boolean
) => {
  return {
    type: ASSET_SET_ASSET_IS_TRANSPARENCY,
    payload: {
      id,
      isTransparency
    }
  }
}
