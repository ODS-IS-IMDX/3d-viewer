// Copyright (c) 2025 NTT InfraNet
// @flow
import type { ShadowOptions } from '../types'

// Actions
export const SITE_SET_VIEWER = 'SITE_SET_VIEWER'
export const SITE_UNSET_VIEWER = 'SITE_UNSET_VIEWER'
export const SITE_SET_VIEWER_SHADOW_OPTIONS = 'SITE_SET_VIEWER_SHADOW_OPTIONS'
export const SITE_SET_MAP_CONTROL_MOUSE_SETTINGS =
  'SITE_SET_MAP_CONTROL_MOUSE_SETTINGS'
export const SITE_SET_MAP_CONTROL_KEY_SETTINGS =
  'SITE_SET_MAP_CONTROL_KEY_SETTINGS'

// Types
export type SiteSetViewerAction = {
  type: 'SITE_SET_VIEWER',
  payload: {
    viewer: any
  }
}

export type SiteUnsetViewerAction = {
  type: 'SITE_UNSET_VIEWER'
}

export type SiteSetViewerShadowOptionsAction = {
  type: typeof SITE_SET_VIEWER_SHADOW_OPTIONS,
  payload: ShadowOptions
}

export type SiteSetMapControlMouseSettingsAction = {
  type: typeof SITE_SET_MAP_CONTROL_MOUSE_SETTINGS,
  payload: {
    horizontal?: Array<string>,
    rotate?: Array<string>,
    zoom?: Array<string>
  }
}

export type SiteSetMapControlKeySettingsAction = {
  type: typeof SITE_SET_MAP_CONTROL_KEY_SETTINGS,
  payload: {
    zoomIn?: string,
    zoomOut?: string,
    moveUp?: string,
    moveDown?: string,
    moveFoward?: string,
    moveBackward?: string,
    moveLeft?: string,
    moveRight?: string,
    rotateUp?: string,
    rotateDown?: string,
    rotateLeft?: string,
    rotateRight?: string,
    twistLeft?: string,
    twistRight?: string
  }
}

export type SiteViewerAction =
  | SiteSetViewerAction
  | SiteUnsetViewerAction
  | SiteSetViewerShadowOptionsAction
  | SiteSetMapControlMouseSettingsAction
  | SiteSetMapControlKeySettingsAction

// Action creators

export const setViewer = (viewer: any): SiteSetViewerAction => ({
  type: SITE_SET_VIEWER,
  payload: { viewer }
})

export const unsetViewer = (): SiteUnsetViewerAction => ({
  type: SITE_UNSET_VIEWER
})

/**
 * 影表示設定
 */
export const setShadowOptions = (
  shadowOptions: ShadowOptions
): SiteSetViewerShadowOptionsAction => ({
  type: SITE_SET_VIEWER_SHADOW_OPTIONS,
  payload: { ...shadowOptions }
})

export const setMapControlMouseSettings = (
  horizontal?: Array<string>,
  rotate?: Array<string>,
  zoom?: Array<string>
): SiteSetMapControlMouseSettingsAction => ({
  type: SITE_SET_MAP_CONTROL_MOUSE_SETTINGS,
  payload: {
    horizontal,
    rotate,
    zoom
  }
})

export const setMapControlKeySettings = (
  zoomIn?: string,
  zoomOut?: string,
  moveUp?: string,
  moveDown?: string,
  moveFoward?: string,
  moveBackward?: string,
  moveLeft?: string,
  moveRight?: string,
  rotateUp?: string,
  rotateDown?: string,
  rotateLeft?: string,
  rotateRight?: string,
  twistLeft?: string,
  twistRight?: string
): SiteSetMapControlKeySettingsAction => ({
  type: SITE_SET_MAP_CONTROL_KEY_SETTINGS,
  payload: {
    zoomIn,
    zoomOut,
    moveUp,
    moveDown,
    moveFoward,
    moveBackward,
    moveLeft,
    moveRight,
    rotateUp,
    rotateDown,
    rotateLeft,
    rotateRight,
    twistLeft,
    twistRight
  }
})
