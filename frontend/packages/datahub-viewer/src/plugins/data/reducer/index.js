// Copyright (c) 2025 NTT InfraNet
// @flow
import { combineReducers } from 'redux'

import { metaReducer, type DataMetaState } from './meta'
import { timelineReducer, type DataTimelineState } from './timeline'
import { deleteItemReducer, type DataDeleteState } from './delete'
import type { DataAction } from '../actions'

export * from './meta'
export * from './timeline'

// Types
export type DataState = $ReadOnly<{|
  meta: DataMetaState,
  timeline: DataTimelineState,
  delete: DataDeleteState
|}>

export type DataReducer = (state: DataState, action: DataAction) => DataState

// Reducer
export const reducer: DataReducer = combineReducers({
  meta: metaReducer,
  timeline: timelineReducer,
  delete: deleteItemReducer
})
