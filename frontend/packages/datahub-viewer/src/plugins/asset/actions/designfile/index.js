// Copyright (c) 2025 NTT InfraNet
// @flow

import { type AssetID } from '../../reducer'

// Type definitions
export type DesignfileFlyToAction = {
  type: 'DESIGNFILE_FLY_TO',
  payload: {
    id: AssetID
  }
}

export type DesignfileSetVisibilityAction = {
  type: 'DESIGNFILE_SET_VISIBILITY',
  payload: {
    id: AssetID,
    isVisible: boolean
  }
}

export type DesignfileNotifyRenderingCompletedActioin = {
  type: 'DESIGNFILE_NOTIFY_RENDERING_COMPLETED',
  payload: {
    id: AssetID
  }
}

export type DesignfileAction =
  | DesignfileFlyToAction
  | DesignfileSetVisibilityAction
  | DesignfileNotifyRenderingCompletedActioin

// Action types
export const DESIGNFILE_FLY_TO = 'DESIGNFILE_FLY_TO'
export const DESIGNFILE_SET_VISIBILITY = 'DESIGNFILE_SET_VISIBILITY'
export const DESIGNFILE_NOTIFY_RENDERING_COMPLETED =
  'DESIGNFILE_NOTIFY_RENDERING_COMPLETED'

// Action creators
export const flyToDesignfile = (id: AssetID) => {
  return {
    type: DESIGNFILE_FLY_TO,
    payload: {
      id
    }
  }
}

export const setDesignfileVisibility = (id: AssetID, isVisible: boolean) => {
  return {
    type: DESIGNFILE_SET_VISIBILITY,
    payload: {
      id,
      isVisible
    }
  }
}

export const notifyDesignfileRenderingCompleted = (id: AssetID) => {
  return {
    type: DESIGNFILE_NOTIFY_RENDERING_COMPLETED,
    payload: {
      id
    }
  }
}
