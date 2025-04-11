// Copyright (c) 2025 NTT InfraNet
// @flow
// Type definitions
export type FileDownloadFile = {
  type: 'FILE_DOWNLOAD_FILE',
  payload: {
    fileType: string,
    id: string
  }
}
export type FileAddIntoDownloadingListAction = {
  type: 'FILE_ADD_INTO_DOWNLOADING_LIST',
  payload: {
    id: string
  }
}
export type FileRemoveFromDownloadingListAction = {
  type: 'FILE_REMOVE_FROM_DOWNLOADING_LIST',
  payload: {
    id: string
  }
}
export type FileDownloadAction =
  | FileDownloadFile
  | FileAddIntoDownloadingListAction
  | FileRemoveFromDownloadingListAction

// Action types
export const FILE_DOWNLOAD_FILE = 'FILE_DOWNLOAD_FILE'
export const FILE_ADD_INTO_DOWNLOADING_LIST = 'FILE_ADD_INTO_DOWNLOADING_LIST'
export const FILE_REMOVE_FROM_DOWNLOADING_LIST =
  'FILE_REMOVE_FROM_DOWNLOADING_LIST'

// Action creators
export const downloadFile = (fileType: string, id: string) => ({
  type: FILE_DOWNLOAD_FILE,
  payload: { fileType, id }
})
export const addIntoDownloadingList = (id: string) => ({
  type: FILE_ADD_INTO_DOWNLOADING_LIST,
  payload: { id }
})
export const removeFromDownloadingList = (id: string) => ({
  type: FILE_REMOVE_FROM_DOWNLOADING_LIST,
  payload: { id }
})
