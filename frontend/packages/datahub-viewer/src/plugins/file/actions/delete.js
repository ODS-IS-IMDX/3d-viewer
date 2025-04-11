// Copyright (c) 2025 NTT InfraNet
// @flow
import type { AssetID } from 'plugins/asset/reducer'

// Type definitions
export type FileDeleteFile = {
  type: 'FILE_DELETE_FILE',
  payload: {
    fileType: string,
    id: AssetID
  }
}

export type FileDeleteAction = FileDeleteFile

// Action types
export const FILE_DELETE_FILE = 'FILE_DELETE_FILE'

// Action creators
export const deleteFile = (fileType: string, id: AssetID) => ({
  type: FILE_DELETE_FILE,
  payload: { fileType, id }
})
