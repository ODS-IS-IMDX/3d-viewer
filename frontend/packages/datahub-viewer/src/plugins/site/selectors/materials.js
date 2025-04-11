// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'
import type { RootState } from '../../../index'
import type { SiteMaterialState } from '../reducer/material'
import type { MaterialContourOptions } from '../types'

const materialStateSelector = (state: RootState): SiteMaterialState =>
  state.site.material

/**
 * 等高線の設定値を取得
 */
export const getMaterialContourOptions: RootState => MaterialContourOptions = createSelector(
  materialStateSelector,
  material => material.contour
)
