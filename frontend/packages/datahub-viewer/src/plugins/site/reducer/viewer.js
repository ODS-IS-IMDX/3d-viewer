// Copyright (c) 2025 NTT InfraNet
// @flow

import type { MapControlMouseType, MapControlKeyType } from '../types'

import {
  SITE_SET_VIEWER,
  SITE_UNSET_VIEWER,
  SITE_SET_VIEWER_SHADOW_OPTIONS,
  SITE_SET_MAP_CONTROL_MOUSE_SETTINGS,
  SITE_SET_MAP_CONTROL_KEY_SETTINGS,
  type SiteViewerAction
} from '../actions'

export type SiteViewerState = {
  ref: any,
  shadow: {
    isShadow: boolean,
    isEntityShadow: boolean,
    isTerrainShadow: boolean,
    datetime: Date | null
  },
  /** マップコントロール */
  control: {
    /** 地図操作設定 */
    settings: {
      /** マウス操作 */
      mouse: MapControlMouseType,
      /** キーボード */
      key: MapControlKeyType
    }
  }
}

export const initialState: SiteViewerState = {
  ref: undefined,
  shadow: {
    isShadow: false,
    isEntityShadow: true,
    isTerrainShadow: true,
    datetime: null
  },
  control: {
    settings: {
      mouse: {
        horizontal: [0],
        rotate: [2],
        zoom: [3, 4]
      },
      key: {
        zoomIn: '',
        zoomOut: '',
        moveUp: '',
        moveDown: '',
        moveFoward: '',
        moveBackward: '',
        moveLeft: '',
        moveRight: '',
        rotateUp: '',
        rotateDown: '',
        rotateLeft: '',
        rotateRight: '',
        twistLeft: '',
        twistRight: ''
      }
    }
  }
}

export default function viewer (
  state: SiteViewerState = initialState,
  action: SiteViewerAction
): SiteViewerState {
  let newState = state

  switch (action.type) {
    case SITE_SET_VIEWER:
      newState = {
        ...state,
        ref: action.payload.viewer
      }
      break
    case SITE_UNSET_VIEWER:
      newState = {
        ...state,
        ref: undefined
      }
      break
    case SITE_SET_VIEWER_SHADOW_OPTIONS:
      newState = {
        ...state,
        shadow: {
          isShadow: action.payload.isShadow ?? state.shadow.isShadow,
          isEntityShadow:
            action.payload.isEntityShadow ?? state.shadow.isEntityShadow,
          isTerrainShadow:
            action.payload.isTerrainShadow ?? state.shadow.isTerrainShadow,
          datetime: action.payload.datetime || state.shadow.datetime
        }
      }
      break
    case SITE_SET_MAP_CONTROL_MOUSE_SETTINGS:
      newState = {
        ...state,
        control: {
          ...state.control,
          settings: {
            ...state.control.settings,
            mouse: {
              horizontal:
                action.payload.horizontal ??
                state.control.settings.mouse.horizontal,
              rotate:
                action.payload.rotate ?? state.control.settings.mouse.rotate,
              zoom: action.payload.zoom ?? state.control.settings.mouse.zoom
            }
          }
        }
      }
      break
    case SITE_SET_MAP_CONTROL_KEY_SETTINGS:
      newState = {
        ...state,
        control: {
          ...state.control,
          settings: {
            ...state.control.settings,
            key: {
              zoomIn:
                action.payload.zoomIn ?? state.control.settings.key.zoomIn,
              zoomOut:
                action.payload.zoomOut ?? state.control.settings.key.zoomOut,
              moveUp:
                action.payload.moveUp ?? state.control.settings.key.moveUp,
              moveDown:
                action.payload.moveDown ?? state.control.settings.key.moveDown,
              moveFoward:
                action.payload.moveFoward ??
                state.control.settings.key.moveFoward,
              moveBackward:
                action.payload.moveBackward ??
                state.control.settings.key.moveBackward,
              moveLeft:
                action.payload.moveLeft ?? state.control.settings.key.moveLeft,
              moveRight:
                action.payload.moveRight ??
                state.control.settings.key.moveRight,
              rotateUp:
                action.payload.rotateUp ?? state.control.settings.key.rotateUp,
              rotateDown:
                action.payload.rotateDown ??
                state.control.settings.key.rotateDown,
              rotateLeft:
                action.payload.rotateLeft ??
                state.control.settings.key.rotateLeft,
              rotateRight:
                action.payload.rotateRight ??
                state.control.settings.key.rotateRight,
              twistLeft:
                action.payload.twistLeft ??
                state.control.settings.key.twistLeft,
              twistRight:
                action.payload.twistRight ??
                state.control.settings.key.twistRight
            }
          }
        }
      }
      break
    default:
      break
  }

  return newState
}
