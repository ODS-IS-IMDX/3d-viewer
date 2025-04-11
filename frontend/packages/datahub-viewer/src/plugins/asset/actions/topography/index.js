// Copyright (c) 2025 NTT InfraNet
// @flow

import { type AssetID } from '../../reducer'

// Type definitions
export type TopographyFlyToAction = {
  type: 'TOPOGRAPHY_FLY_TO',
  payload: {
    id: AssetID
  }
}

export type TopographySetVisibilityAction = {
  type: 'TOPOGRAPHY_SET_VISIBILITY',
  payload: {
    id: AssetID,
    isVisible: boolean
  }
}
export type TopographyNotifyRenderingCompletedActioin = {
  type: 'TOPOGRAPHY_NOTIFY_RENDERING_COMPLETED',
  payload: {
    id: AssetID
  }
}
export type TopographySetPointSizeAction = {
  type: 'TOPOGRAPHY_SET_POINTSIZE',
  payload: {
    id: AssetID,
    pointSize: number
  }
}
export type TopographySetTransparencyAction = {
  type: 'TOPOGRAPHY_SET_TRANSPARENCY',
  payload: {
    id: AssetID,
    transparency: number
  }
}

export type TopographyAction =
  | TopographyFlyToAction
  | TopographySetVisibilityAction
  | TopographyNotifyRenderingCompletedActioin
  | TopographySetPointSizeAction
  | TopographySetTransparencyAction

// Action types
export const TOPOGRAPHY_FLY_TO = 'TOPOGRAPHY_FLY_TO'
export const TOPOGRAPHY_SET_VISIBILITY = 'TOPOGRAPHY_SET_VISIBILITY'
export const TOPOGRAPHY_NOTIFY_RENDERING_COMPLETED =
  'TOPOGRAPHY_NOTIFY_RENDERING_COMPLETED'
export const TOPOGRAPHY_SET_POINTSIZE = 'TOPOGRAPHY_SET_POINTSIZE'
export const TOPOGRAPHY_SET_TRANSPARENCY = 'TOPOGRAPHY_SET_TRANSPARENCY'

// Action creators
export const flyToTopography = (id: AssetID) => {
  return {
    type: TOPOGRAPHY_FLY_TO,
    payload: {
      id
    }
  }
}

export const setTopographyVisibility = (id: AssetID, isVisible: boolean) => {
  return {
    type: TOPOGRAPHY_SET_VISIBILITY,
    payload: {
      id,
      isVisible
    }
  }
}
export const notifyTopographyRenderingCompleted = (id: AssetID) => {
  return {
    type: TOPOGRAPHY_NOTIFY_RENDERING_COMPLETED,
    payload: {
      id
    }
  }
}
export const setTopographyPointSize = (id: AssetID, pointSize: number) => {
  return {
    type: TOPOGRAPHY_SET_POINTSIZE,
    payload: {
      id,
      pointSize
    }
  }
}
export const setTopographyTransparency = (
  id: AssetID,
  transparency: number
) => {
  return {
    type: TOPOGRAPHY_SET_TRANSPARENCY,
    payload: {
      id,
      transparency
    }
  }
}
