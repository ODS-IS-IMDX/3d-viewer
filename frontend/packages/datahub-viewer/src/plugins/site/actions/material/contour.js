// Copyright (c) 2025 NTT InfraNet
// @flow
// Action
/** 等高線の表示設定 */
export const MATERIAL_CONTOUR_SET_OPTIONS = 'MATERIAL_CONTOUR_SET_OPTIONS'

// Type
export type MaterialContourSetOptionsAction = {
  type: typeof MATERIAL_CONTOUR_SET_OPTIONS,
  payload: {
    enable?: boolean,
    spacing?: number,
    color?: string
  }
}

export type MaterialContourAction = MaterialContourSetOptionsAction

// Action creator
/** 等高線の表示設定 */
export const setContourOptions = (
  enable?: boolean,
  spacing?: number,
  color?: string
): MaterialContourSetOptionsAction => ({
  type: MATERIAL_CONTOUR_SET_OPTIONS,
  payload: {
    enable,
    spacing,
    color
  }
})
