// Copyright (c) 2025 NTT InfraNet
// @flow
import { combineReducers } from 'redux'

import assetList, { type AssetListState } from './assetList'
import edit, { type AssetEditState } from './edit'
import meta, { type AssetMetaState } from './meta'
import type { AssetAction } from '../actions'

export * from './assetList'
export * from './edit'
export * from './meta'

// Types
export type AssetState = $ReadOnly<{|
  assetList: AssetListState,
  edit: AssetEditState,
  meta: AssetMetaState
|}>

export type AssetReducer = (
  state: AssetState,
  action: AssetAction
) => AssetState

// Reducer
const reducer: AssetReducer = combineReducers({
  assetList,
  edit,
  meta
})

export default reducer
