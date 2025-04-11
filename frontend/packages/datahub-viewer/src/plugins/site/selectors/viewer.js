// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { SiteViewerState } from '../reducer/viewer'
import type { ShadowOptions } from '../types'

const viewerStateSelector = (state: RootState): SiteViewerState =>
  state.site.viewer

export const getViewer: RootState => any = createSelector(
  viewerStateSelector,
  viewer => viewer.ref
)

/**
 * 影表示設定を取得する
 */
export const getShadowOptions: RootState => ShadowOptions = createSelector(
  viewerStateSelector,
  viewer => viewer.shadow
)

/**
 * 地図のマウス操作設定を取得する
 */
export const getMapControlMouseSettings: RootState => any = createSelector(
  viewerStateSelector,
  viewer => viewer.control.settings.mouse
)
/**
 * 地図のキーボード操作設定を取得する
 */
export const getMapControlKeySettings: RootState => any = createSelector(
  viewerStateSelector,
  viewer => viewer.control.settings.key
)
