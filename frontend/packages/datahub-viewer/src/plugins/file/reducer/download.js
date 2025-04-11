// Copyright (c) 2025 NTT InfraNet
// @flow
import {
  FILE_ADD_INTO_DOWNLOADING_LIST,
  FILE_REMOVE_FROM_DOWNLOADING_LIST,
  type FileDownloadAction
} from 'plugins/file/actions'

export type FileDownloadState = {
  downloadingFileIdList: Array<string>
}

const initState: FileDownloadState = {
  downloadingFileIdList: []
}

export const downloadReducer = (
  state: FileDownloadState = initState,
  action: FileDownloadAction
) => {
  switch (action.type) {
    case FILE_ADD_INTO_DOWNLOADING_LIST: {
      return {
        ...state,
        downloadingFileIdList: [
          ...state.downloadingFileIdList,
          action.payload.id
        ]
      }
    }
    case FILE_REMOVE_FROM_DOWNLOADING_LIST: {
      return {
        ...state,
        downloadingFileIdList: state.downloadingFileIdList.filter(
          (id: string) => !(id === action.payload.id)
        )
      }
    }
    default:
      return state
  }
}
