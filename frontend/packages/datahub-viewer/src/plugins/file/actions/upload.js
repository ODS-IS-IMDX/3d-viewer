// Copyright (c) 2025 NTT InfraNet
// @flow
import type { CancelTokenSource } from 'axios'
import type {
  UploadFile,
  UploadFileInfo,
  UploadFileWarning
} from 'plugins/file/reducer'
import type { AssetID } from 'plugins/asset/reducer'

export type FilePutFilesIntoStateAction = {
  type: 'FILE_PUT_FILES_INTO_STATE',
  payload: { files: Array<UploadFile> }
}
export type FileSelectFileAction = {
  type: 'FILE_SELECT_FILE',
  payload: { index: number }
}
export type FileSetFilesInfoAction = {
  type: 'FILE_SET_FILES_INFO',
  payload: { indexList: Array<number>, info: UploadFileInfo }
}
export type FileSetFileWarningAction = {
  type: 'FILE_SET_FILE_WARNING',
  payload: { index: number, warning: UploadFileWarning }
}
export type FileDeleteFileFromListAction = {
  type: 'FILE_DELETE_FILE_FROM_LIST',
  payload: { index: number }
}
export type FileUploadFilesAction = {
  type: 'FILE_UPLOAD_FILES',
  payload: {
    files: Array<UploadFile>
  }
}
export type FileSetAxiosCancelSourceAction = {
  type: 'FILE_SET_AXIOS_CANCEL_SOURCE',
  payload: {
    source: CancelTokenSource,
    tempId: string
  }
}
export type FileSetUploadProgressAction = {
  type: 'FILE_SET_UPLOAD_PROGRESS',
  payload: { tempId: string, progress: number }
}
export type FileSetAssetIdAction = {
  type: 'FILE_SET_ASSET_ID',
  payload: { tempId: string, assetId: AssetID }
}
export type FileCancelUploadAction = {
  type: 'FILE_CANCEL_UPLOAD',
  payload: { tempId: string }
}
export type FileDeleteFileByTempIdAction = {
  type: 'FILE_DELETE_FILE_BY_TEMP_ID',
  payload: { tempId: string }
}
export type FileStartWatchUploadFileAction = {
  type: 'FILE_START_WATCH_UPLOAD_FILE'
}
export type FileStopWatchUploadFileAction = {
  type: 'FILE_STOP_WATCH_UPLOAD_FILE'
}
export type FileRenewUploadingFilesNumberAction = {
  type: 'FILE_RENEW_UPLOAD_FILES_NUMBER'
}
export type FileClearPrepareFilesAction = {
  type: 'FILE_CLEAR_PREPARE_FILES'
}
export type FileChangeStatusAction = {
  type: 'FILE_CHANGE_STATUS',
  payload: { tempId: string, status: string }
}

// Action types
export const FILE_PUT_FILES_INTO_STATE = 'FILE_PUT_FILES_INTO_STATE'
export const FILE_SELECT_FILE = 'FILE_SELECT_FILE'
export const FILE_SET_FILES_INFO = 'FILE_SET_FILES_INFO'
export const FILE_SET_FILE_WARNING = 'FILE_SET_FILE_WARNING'
export const FILE_DELETE_FILE_FROM_LIST = 'FILE_DELETE_FILE_FROM_LIST'
export const FILE_UPLOAD_FILES = 'FILE_UPLOAD_FILES'
export const FILE_SET_AXIOS_CANCEL_SOURCE = 'FILE_SET_AXIOS_CANCEL_SOURCE'
export const FILE_SET_UPLOAD_PROGRESS = 'FILE_SET_UPLOAD_PROGRESS'
export const FILE_SET_ASSET_ID = 'FILE_SET_ASSET_ID'
export const FILE_CANCEL_UPLOAD = 'FILE_CANCEL_UPLOAD'
export const FILE_DELETE_FILE_BY_TEMP_ID = 'FILE_DELETE_FILE_BY_TEMP_ID'
export const FILE_START_WATCH_UPLOAD_FILE = 'FILE_START_WATCH_UPLOAD_FILE'
export const FILE_STOP_WATCH_UPLOAD_FILE = 'FILE_STOP_WATCH_UPLOAD_FILE'
export const FILE_RENEW_UPLOAD_FILES_NUMBER = 'FILE_RENEW_UPLOAD_FILES_NUMBER'
export const FILE_CLEAR_PREPARE_FILES = 'FILE_CLEAR_PREPARE_FILES'
export const FILE_CHANGE_STATUS = 'FILE_CHANGE_STATUS'

// Action creators
export const putFilesIntoState = (files: Array<UploadFile>) => ({
  type: FILE_PUT_FILES_INTO_STATE,
  payload: { files }
})
export const selectFile = (index: number) => ({
  type: FILE_SELECT_FILE,
  payload: { index }
})
export const setFilesInfo = ({
  indexList,
  info
}: {
  indexList: Array<number>,
  info: UploadFileInfo
}) => ({
  type: FILE_SET_FILES_INFO,
  payload: { indexList, info }
})
export const setFileWarning = ({
  index,
  warning
}: {
  index: number,
  warning: UploadFileWarning
}) => ({
  type: FILE_SET_FILE_WARNING,
  payload: { index, warning }
})
export const deleteFileFromList = (index: number) => ({
  type: FILE_DELETE_FILE_FROM_LIST,
  payload: { index }
})
export const uploadFiles = (files: Array<UploadFile>) => ({
  type: FILE_UPLOAD_FILES,
  payload: { files }
})
export const setAxiosCancelSource = ({
  source,
  tempId
}: {
  source: CancelTokenSource,
  tempId: string
}) => ({
  type: FILE_SET_AXIOS_CANCEL_SOURCE,
  payload: { source, tempId }
})
export const setUploadProgress = ({
  tempId,
  progress
}: {
  tempId: string,
  progress: number
}) => ({
  type: FILE_SET_UPLOAD_PROGRESS,
  payload: { tempId, progress }
})
export const setAssetId = ({
  tempId,
  assetId
}: {
  tempId: string,
  assetId: AssetID
}) => ({
  type: FILE_SET_ASSET_ID,
  payload: { tempId, assetId }
})
export const cancelUpload = (tempId: string) => ({
  type: FILE_CANCEL_UPLOAD,
  payload: { tempId }
})
export const deleteFileByTempId = (tempId: string) => ({
  type: FILE_DELETE_FILE_BY_TEMP_ID,
  payload: { tempId }
})
export const startWatchUploadFile = () => ({
  type: FILE_START_WATCH_UPLOAD_FILE
})
export const stopWatchUploadFile = () => ({
  type: FILE_STOP_WATCH_UPLOAD_FILE
})
export const renewUploadingFilesNumber = () => ({
  type: FILE_RENEW_UPLOAD_FILES_NUMBER
})
export const clearPrepareFiles = () => ({
  type: FILE_CLEAR_PREPARE_FILES
})
export const changeStatus = ({
  tempId,
  status
}: {
  tempId: string,
  status: string
}) => ({
  type: FILE_CHANGE_STATUS,
  payload: { tempId, status }
})

export type FileUploadAction =
  | FilePutFilesIntoStateAction
  | FileSelectFileAction
  | FileSetFilesInfoAction
  | FileSetFileWarningAction
  | FileDeleteFileFromListAction
  | FileUploadFilesAction
  | FileSetAxiosCancelSourceAction
  | FileSetUploadProgressAction
  | FileSetAssetIdAction
  | FileCancelUploadAction
  | FileDeleteFileByTempIdAction
  | FileStartWatchUploadFileAction
  | FileStopWatchUploadFileAction
  | FileRenewUploadingFilesNumberAction
  | FileClearPrepareFilesAction
  | FileChangeStatusAction
