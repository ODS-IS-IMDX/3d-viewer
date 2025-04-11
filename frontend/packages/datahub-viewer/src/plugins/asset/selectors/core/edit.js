// Copyright (c) 2025 NTT InfraNet
// @flow
import { createSelector } from 'reselect'

import type { RootState } from 'index'
import type { AssetEditState, AssetMetaData } from '../reducer'
import type { Asset } from '../types'

const assetEditStateSelector = (state: RootState): AssetEditState =>
  state.asset.edit

export const getAssetMetaData: (
  state: RootState
) => AssetMetaData = createSelector(
  assetEditStateSelector,
  (state: AssetEditState) => state.target
)

export const getTransformEditor: (state: RootState) => any = createSelector(
  assetEditStateSelector,
  (state: AssetEditState) => state.transformEditor
)

export const getOriginData: (state: RootState) => any = createSelector(
  assetEditStateSelector,
  (state: AssetEditState) => ({
    originModelMatrix: state.originModelMatrix,
    modelMatrix: state.modelMatrix,
    rootTransform: state.rootTransform
  })
)

// 編集データを取得
export const getEditingData: (state: RootState) => Asset = createSelector(
  assetEditStateSelector,
  (state: AssetEditState) => state.editingData
)
