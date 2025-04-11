// Copyright (c) 2025 NTT InfraNet
// @flow
// Type definitions
export type DataChangeMenuMode = {
  type: 'DATA_CHANGE_MENU_MODE',
  payload: {
    menuMode: string
  }
}
export type DataOpenDrawerAction = {
  type: 'DATA_OPEN_DRAWER'
}
export type DataCloseDrawerAction = {
  type: 'DATA_CLOSE_DRAWER'
}

export type DataMetaAction =
  | DataChangeMenuMode
  | DataOpenDrawerAction
  | DataCloseDrawerAction

// Action types
export const DATA_CHANGE_MENU_MODE = 'DATA_CHANGE_MENU_MODE'
export const DATA_OPEN_DRAWER = 'DATA_OPEN_DRAWER'
export const DATA_CLOSE_DRAWER = 'DATA_CLOSE_DRAWER'

// Action creators
export const changeMenuMode = (menuMode: string): DataChangeMenuMode => ({
  type: DATA_CHANGE_MENU_MODE,
  payload: {
    menuMode
  }
})
export const openDrawer = (): DataOpenDrawerAction => ({
  type: DATA_OPEN_DRAWER
})
export const closeDrawer = (): DataCloseDrawerAction => ({
  type: DATA_CLOSE_DRAWER
})
