// Copyright (c) 2025 NTT InfraNet
// @flow
import type { CancelTokenSource } from 'axios'
import { getExtension } from 'utils/files'
import {
  FILE_PUT_FILES_INTO_STATE,
  FILE_SELECT_FILE,
  FILE_SET_FILES_INFO,
  FILE_SET_FILE_WARNING,
  FILE_DELETE_FILE_FROM_LIST,
  FILE_UPLOAD_FILES,
  FILE_SET_AXIOS_CANCEL_SOURCE,
  FILE_SET_UPLOAD_PROGRESS,
  FILE_SET_ASSET_ID,
  FILE_DELETE_FILE_BY_TEMP_ID,
  FILE_RENEW_UPLOAD_FILES_NUMBER,
  FILE_CLEAR_PREPARE_FILES,
  FILE_CHANGE_STATUS,
  type FileUploadAction
} from 'plugins/file/actions'
import {
  ALLOWED_EXTENSION_LIST,
  CATEGORY,
  FILE_UPLOAD_STATUS
} from 'plugins/file/constants'

import type { AssetID, AssetCustomPosition } from 'plugins/asset/reducer'

type CesiumOptions = {|
  srid: number | null,
  verticalSrid: number | null,
  isTerrain: boolean | null,
  addTerrain: boolean | null,
  cellSpacing: number | null,
  baseTerrainId: number | null
|}

export type UploadFileInfo = {|
  cesiumOptions?: CesiumOptions,
  category: string,
  formatType: string,
  locationInfo: AssetCustomPosition | null,
  startDateTime: Date | null,
  endDateTime: Date | null,
  isSpace: boolean | null
|}

export type UploadFile = {|
  id?: AssetID,
  /** 該当ファイルのstateを変更や削除用一時的な識別ID */
  tempId: string,
  file: File,
  fileSystemName: string | null,
  fullPath: string,
  info?: UploadFileInfo,
  isAllowed: boolean,
  name: string,
  size: number,
  type: string,
  axiosCancelSource?: CancelTokenSource,
  status: string,
  progress?: number
|}

export type MobileUploadFile = {|
  tempId?: string,
  file: File,
  isAllowed?: boolean,
  info: {
    // モバイル版アップロード対象は写真のみのため、categoryのtypeを固定する
    category: 'picture',
    locationInfo: ImageCustomPosition | null,
    imageMeta?: {
      coordinates: Array<number>
    }
  },
  name: string,
  size: number,
  type: string,
  axiosCancelSource?: CancelTokenSource,
  status?: string,
  progress?: number
|}

export type FileUploadState = {|
  files: Array<UploadFile>,
  selectedFileIndex: number | null,
  uploadingFilesNumber: number,
  needUploadFilesNumber: number
|}

const initialState = {
  files: [],
  selectedFileIndex: null,
  uploadingFilesNumber: 0,
  needUploadFilesNumber: 0
}

export const uploadReducer = (
  state: FileUploadState = initialState,
  action: FileUploadAction
) => {
  switch (action.type) {
    case FILE_PUT_FILES_INTO_STATE:
      return {
        ...state,
        files: action.payload.files
          .map<UploadFile>((file, index) => ({
            ...file,
            isAllowed: ALLOWED_EXTENSION_LIST.includes(getExtension(file.name)),
            tempId: `${new Date().getTime()}-${index}`
          }))
          .concat(state.files)
      }
    case FILE_SELECT_FILE:
      return {
        ...state,
        selectedFileIndex: action.payload.index
      }
    case FILE_SET_FILES_INFO: {
      const { indexList, info } = action.payload
      let i = 0
      return {
        ...state,
        files: state.files.map<UploadFile>((file, index) => {
          if (indexList[i] === index) {
            ++i
            return { ...file, info }
          } else {
            return file
          }
        })
      }
    }
    case FILE_SET_FILE_WARNING: {
      const { index, warning } = action.payload
      return {
        ...state,
        files: state.files.map<UploadFile>((file, i) =>
          index === i
            ? {
                ...file,
                warning: file.warning
                  ? { ...file.warning, ...warning }
                  : warning
              }
            : file
        )
      }
    }
    case FILE_DELETE_FILE_FROM_LIST:
      return {
        ...state,
        // $FlowFixMe[infererror]
        files: state.files.filter(
          (file, index) => index !== action.payload.index
        )
      }
    case FILE_UPLOAD_FILES: {
      return {
        ...state,
        files: state.files.map(file =>
          !file.status ? { ...file, status: FILE_UPLOAD_STATUS.WAITING } : file
        )
      }
    }
    case FILE_SET_AXIOS_CANCEL_SOURCE:
      return {
        ...state,
        files: state.files.map<UploadFile>(file =>
          // $FlowFixMe[infererror]
          file.tempId === action.payload.tempId
            ? { ...file, axiosCancelSource: action.payload.source }
            : file
        )
      }
    case FILE_SET_UPLOAD_PROGRESS: {
      const { tempId, progress } = action.payload
      return {
        ...state,
        files: state.files.map<UploadFile>(file =>
          file.tempId === tempId && file.status
            ? {
                ...file,
                progress,
                status:
                  progress < 100
                    ? FILE_UPLOAD_STATUS.UPLOADING
                    : FILE_UPLOAD_STATUS.DONE
              }
            : file
        )
      }
    }
    case FILE_SET_ASSET_ID: {
      const { tempId, assetId } = action.payload
      return {
        ...state,
        files: state.files.map<UploadFile>(file =>
          file.tempId === tempId ? { ...file, id: assetId } : file
        )
      }
    }
    case FILE_DELETE_FILE_BY_TEMP_ID: {
      const { tempId } = action.payload
      return {
        ...state,
        files: state.files.filter(file => file.tempId !== tempId)
      }
    }
    case FILE_RENEW_UPLOAD_FILES_NUMBER: {
      const uploadingFilesNumber = state.files.filter(file => {
        const fileCategory = file.info ? file.info.category : ''
        return (
          file.status === FILE_UPLOAD_STATUS.UPLOADING ||
          (file.status === FILE_UPLOAD_STATUS.DONE &&
            fileCategory !== CATEGORY.BLACKBOARD)
        )
      }).length
      const needUploadFilesNumber = state.files.filter(file => {
        const fileCategory = file.info ? file.info.category : ''
        return (
          file.status === FILE_UPLOAD_STATUS.WAITING ||
          file.status === FILE_UPLOAD_STATUS.UPLOADING ||
          (file.status === FILE_UPLOAD_STATUS.DONE &&
            fileCategory !== CATEGORY.BLACKBOARD)
        )
      }).length

      return {
        ...state,
        uploadingFilesNumber,
        needUploadFilesNumber
      }
    }
    case FILE_CLEAR_PREPARE_FILES:
      return {
        ...state,
        files: state.files.filter(file => !!file.status)
      }
    case FILE_CHANGE_STATUS: {
      const { tempId, status } = action.payload
      return {
        ...state,
        files: state.files.map<UploadFile>(file =>
          file.tempId === tempId ? { ...file, status } : file
        )
      }
    }
    default:
      return state
  }
}
