// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { FileProgressModalItem } from './FileProgressModalItem'
import { FILE_TILE_STATUS } from 'plugins/file/constants'

import type { TFunction } from 'react-i18next'
import type { TileFile, UploadFile } from 'plugins/file/reducer'
import type {
  FileCancelUploadAction,
  FileDeleteAction
} from 'plugins/file/actions'
import type { AssetID } from 'plugins/asset/reducer'

export type ShowProgressFile = {|
  id: string | null,
  tempId: string | null,
  category: string,
  isValidProgress: boolean,
  isCancelable: boolean,
  name: string,
  progress: number,
  status: string
|}

type FileProgressModalListProps = {
  tileFileList: Array<TileFile>,
  uploadFileList: Array<UploadFile>,
  cancelUpload: (name: string) => FileCancelUploadAction,
  deleteFile: (fileType: string, id: AssetID) => FileDeleteAction,
  t: TFunction
}

const Component = (props: FileProgressModalListProps) => {
  const { tileFileList, uploadFileList, cancelUpload, deleteFile, t } = props

  // データ検索のため、ArrayをMapに変更
  const tileFileMap: Map<string, TileFile> = new Map(
    tileFileList.map(file => [file.id, file])
  )
  // uploadFileListにtileFileと同じIDがあるfileがある場合、tileFileをShowProgressFile形式に変更
  const showProgressFileList: Array<ShowProgressFile> = uploadFileList.map(
    file => {
      // $FlowFixMe[infererror]
      if (tileFileMap.has(file.id)) {
        // $FlowFixMe[infererror]
        const {
          id,
          category,
          isValidProgress,
          isCancelable,
          name,
          ionPercentComplete,
          status
        } = tileFileMap.get(file.id)
        file.status = status
        file.ionPercentComplete = ionPercentComplete
        // $FlowFixMe[infererror]
        tileFileMap.delete(file.id)
        return {
          id,
          tempId: null,
          category,
          isValidProgress,
          isCancelable,
          name,
          progress: ionPercentComplete,
          status
        }
      } else {
        return {
          id: file.id || null,
          tempId: file.tempId,
          // $FlowFixMe[infererror]
          category: file.info && file.info.category,
          isValidProgress: false,
          isCancelable: false,
          name: file.name,
          // $FlowFixMe[infererror]
          progress: file.ionPercentComplete,
          status:
            file.status === FILE_TILE_STATUS.CONVERTING
              ? FILE_TILE_STATUS.CONVERTED
              : file.status
        }
      }
    }
  )
  // tileFileMapの余りをshowProgressFileListに追加
  tileFileMap.forEach(file => {
    const {
      id,
      category,
      isValidProgress,
      isCancelable,
      name,
      ionPercentComplete,
      status
    } = file
    showProgressFileList.push({
      id,
      tempId: null,
      category,
      isValidProgress,
      isCancelable,
      name,
      progress: ionPercentComplete,
      status
    })
  })

  return showProgressFileList.map(file => (
    // アップロード中またはアップロード待機中のファイルのkeyはtempId, 既にタイリング中のファイルのkeyはid(assetId)
    <FileProgressModalItem
      key={file.tempId || file.id}
      showProgressFile={file}
      cancelUpload={cancelUpload}
      deleteFile={deleteFile}
      t={t}
    />
  ))
}

export const FileProgressModalList = React.memo<FileProgressModalListProps>(
  Component
)
