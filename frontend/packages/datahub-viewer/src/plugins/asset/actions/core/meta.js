// Copyright (c) 2025 NTT InfraNet
// @flow

// Type definitions
export type AssetOpenDrawerAction = {
  type: 'ASSET_OPEN_DRAWER'
}

export type AssetCloseDrawerAction = {
  type: 'ASSET_CLOSE_DRAWER'
}

export type AssetEnableDrawerButtonAction = {
  type: 'ASSET_ENABLE_DRAWER_BUTTON'
}

export type AssetDisableDrawerButtonAction = {
  type: 'ASSET_DISABLE_DRAWER_BUTTON'
}

export type AssetMetaAction =
  | AssetOpenDrawerAction
  | AssetCloseDrawerAction
  | AssetEnableDrawerButtonAction
  | AssetDisableDrawerButtonAction

// Action types
export const ASSET_OPEN_DRAWER = 'ASSET_OPEN_DRAWER'
export const ASSET_CLOSE_DRAWER = 'ASSET_CLOSE_DRAWER'
export const ASSET_ENABLE_DRAWER_BUTTON = 'ASSET_ENABLE_DRAWER_BUTTON'
export const ASSET_DISABLE_DRAWER_BUTTON = 'ASSET_DISABLE_DRAWER_BUTTON'

// Action creators
export const openDrawer = () => ({
  type: ASSET_OPEN_DRAWER
})

export const closeDrawer = () => ({
  type: ASSET_CLOSE_DRAWER
})

export const enableDrawerButton = () => ({
  type: ASSET_ENABLE_DRAWER_BUTTON
})

export const disableDrawerButton = () => ({
  type: ASSET_DISABLE_DRAWER_BUTTON
})
