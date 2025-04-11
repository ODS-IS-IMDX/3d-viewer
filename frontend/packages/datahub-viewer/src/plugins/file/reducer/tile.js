// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  FILE_SET_TILING_FILES,
  FILE_SET_TILING_FILES_NUMBER,
  FILE_SET_ERROR_FILES_NUMBER,
  type FileTileAction
} from 'plugins/file/actions'

export type TileFile = {|
  category: string,
  displayOrder: number,
  id: string,
  isValidProgress: boolean,
  isCancelable: boolean,
  name: string,
  progress: number,
  status: string
|}
export type FileTileState = {
  files: Array<TileFile>,
  tilingFilesNumber: number,
  errorFilesNumber: number
}

const initState = {
  files: [],
  tilingFilesNumber: 0,
  errorFilesNumber: 0
}

export const tileReducer = (
  state: FileTileState = initState,
  action: FileTileAction
) => {
  switch (action.type) {
    case FILE_SET_TILING_FILES_NUMBER:
      const { tilingFilesNumber } = action.payload
      return {
        ...state,
        tilingFilesNumber
      }
    case FILE_SET_ERROR_FILES_NUMBER:
      const { errorFilesNumber } = action.payload
      return {
        ...state,
        errorFilesNumber
      }
    case FILE_SET_TILING_FILES:
      const { files } = action.payload
      return {
        ...state,
        files,
        tilingFilesNumber: files.length
      }
    default:
      return state
  }
}
