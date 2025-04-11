// Copyright (c) 2025 NTT InfraNet
// @flow
import type { FileUploadAction } from './upload'
import type { FileTileAction } from './tile'
import type { FileDeleteAction } from './delete'
import type { FileDownloadAction } from './download'

export type FileAction =
  | FileUploadAction
  | FileTileAction
  | FileDeleteAction
  | FileDownloadAction

export * from './upload'
export * from './tile'
export * from './delete'
export * from './download'
