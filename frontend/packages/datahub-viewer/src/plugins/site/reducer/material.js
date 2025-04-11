// Copyright (c) 2025 NTT InfraNet
// @flow
import { MATERIAL_CONTOUR_SET_OPTIONS, type MaterialAction } from '../actions'
import type { MaterialContourOptions } from '../types'

/**
 * Material管理用State
 */
export type SiteMaterialState = {
  /** 等高線 */
  contour: MaterialContourOptions
}

const initialState: SiteMaterialState = {
  contour: {
    enable: false,
    spacing: 100,
    color: '#FFEE53'
  }
}

/**
 * Material管理用Reducer
 */
const materialReducer = (
  state: SiteMaterialState = initialState,
  action: MaterialAction
): SiteMaterialState => {
  let newState = state

  switch (action.type) {
    case MATERIAL_CONTOUR_SET_OPTIONS:
      newState = {
        contour: {
          enable: action.payload.enable ?? state.contour.enable,
          spacing: action.payload.spacing ?? state.contour.spacing,
          color: action.payload.color ?? state.contour.color
        }
      }
      break
    default:
      break
  }

  return newState
}

export default materialReducer
