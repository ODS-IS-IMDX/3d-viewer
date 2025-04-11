// Copyright (c) 2025 NTT InfraNet
// @flow
import { combineReducers } from 'redux'
import { uploadReducer, type FileUploadState } from './upload'
import { tileReducer, type FileTileState } from './tile'
import { downloadReducer, type FileDownloadState } from './download'
import type { FileAction } from '../actions'

export * from './upload'
export * from './tile'
export * from './download'

// Types
export type FileState = $ReadOnly<{|
  upload: FileUploadState,
  tile: FileTileState,
  download: FileDownloadState
|}>

export type FileReducer = (state: FileState, action: FileAction) => FileState

// Reducer
export const reducer: FileReducer = combineReducers({
  upload: uploadReducer,
  tile: tileReducer,
  download: downloadReducer
})
