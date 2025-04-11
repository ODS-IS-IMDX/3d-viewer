// Copyright (c) 2025 NTT InfraNet
// @flow
import type { SiteID } from 'plugins/site/reducer'
import type { TileFile } from 'plugins/file/reducer'

export type FileGetTilingFilesNumberAction = {
  type: 'FILE_GET_TILING_FILES_NUMBER',
  payload: { siteID: SiteID }
}
export type FileSetTilingFilesNumberAction = {
  type: 'FILE_SET_TILING_FILES_NUMBER',
  payload: { tilingFilesNumber: number }
}
export type FileSetErrorFilesNumberAction = {
  type: 'FILE_SET_ERROR_FILES_NUMBER',
  payload: { errorFilesNumber: number }
}
export type FilePollingTilingFilesProgressAction = {
  type: 'FILE_POLLING_TILING_FILES_PROGRESS'
}
export type FileStopPollingTilingFilesProgressAction = {
  type: 'FILE_STOP_POLLING_TILING_FILES_PROGRESS'
}
export type FileSetTilingFilesAction = {
  type: 'FILE_SET_TILING_FILES',
  payload: { files: Array<TileFile> }
}

export const FILE_GET_TILING_FILES_NUMBER = 'FILE_GET_TILING_FILES_NUMBER'
export const FILE_SET_TILING_FILES_NUMBER = 'FILE_SET_TILING_FILES_NUMBER'
export const FILE_SET_ERROR_FILES_NUMBER = 'FILE_SET_ERROR_FILES_NUMBER'
export const FILE_POLLING_TILING_FILES_PROGRESS =
  'FILE_POLLING_TILING_FILES_PROGRESS'
export const FILE_STOP_POLLING_TILING_FILES_PROGRESS =
  'FILE_STOP_POLLING_TILING_FILES_PROGRESS'
export const FILE_SET_TILING_FILES = 'FILE_SET_TILING_FILES'

export const getTilingFilesNumber = (siteId: SiteID) => ({
  type: FILE_GET_TILING_FILES_NUMBER,
  payload: { siteId }
})
export const setTilingFilesNumber = (tilingFilesNumber: number) => ({
  type: FILE_SET_TILING_FILES_NUMBER,
  payload: { tilingFilesNumber }
})
export const setErrorFilesNumber = (errorFilesNumber: number) => ({
  type: FILE_SET_ERROR_FILES_NUMBER,
  payload: { errorFilesNumber }
})
export const pollingTilingFilesProgress = () => ({
  type: FILE_POLLING_TILING_FILES_PROGRESS
})
export const stopPollingTilingFilesProgress = () => ({
  type: FILE_STOP_POLLING_TILING_FILES_PROGRESS
})
export const setTilingFiles = (files: Array<TileFile>) => ({
  type: FILE_SET_TILING_FILES,
  payload: { files }
})

export type FileTileAction =
  | FileGetTilingFilesNumberAction
  | FileSetTilingFilesNumberAction
  | FileSetErrorFilesNumberAction
  | FilePollingTilingFilesProgressAction
  | FileStopPollingTilingFilesProgressAction
  | FileSetTilingFilesAction
