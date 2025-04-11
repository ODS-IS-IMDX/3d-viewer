// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useState } from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis } from 'recharts'
import { Flex, Text } from '@ehv/datahub-components'
import { IconTrash } from '@ehv/datahub-icons'
import {
  FILE_UPLOAD_STATUS,
  FILE_TILE_STATUS,
  FILE_TYPE
} from 'plugins/file/constants'

import type { TFunction } from 'react-i18next'
import type {
  FileCancelUploadAction,
  FileDeleteAction
} from 'plugins/file/actions'
import type { ShowProgressFile } from './FileProgressModalList'
import type { AssetID } from 'plugins/asset/reducer'

type FileProgressModalItemProps = {
  showProgressFile: ShowProgressFile,
  cancelUpload: (name: string) => FileCancelUploadAction,
  deleteFile: (fileType: string, id: AssetID) => FileDeleteAction,
  t: TFunction
}

const TextArea = styled(Text)`
  margin: 5px 0;
  width: 600px;
  font-size: 16px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  ${// $FlowFixMe
  ({ isError }) => isError && 'color: red;'}
`
const ProgressNumberArea = styled(Text)`
  margin: 7px;
  font-size: 16px;
`
const DeleteIconWrapper = styled.div`
  height: 16px;
  width: 16px;
  margin: 9px;
  ${// $FlowFixMe
  ({ isDeleting }) =>
    isDeleting
      ? 'cursor: not-allowed;'
      : `
      cursor: pointer; 
      &:hover {
        transform: scale(1.2);
      }
    `}
`

const buildI18nKey = (showProgressFile: ShowProgressFile) => {
  const ERROR_STATUS = [
    FILE_TILE_STATUS.CONVERT_TOOL_ERROR,
    FILE_TILE_STATUS.CONVERT_ERROR,
    FILE_TILE_STATUS.DELETE_ERROR,
    FILE_TILE_STATUS.DELETE_WAIT_ERROR,
    FILE_TILE_STATUS.S3_COPY_ERROR_FROM_CONVERT_TOOL,
    FILE_TILE_STATUS.S3_COPY_ERROR_FROM_EXTERNAL,
    FILE_TILE_STATUS.S3_UPLOAD_ERROR,
    FILE_TILE_STATUS.S3_UPLOAD_ERROR_TO_CONVERT_TOOL,
    FILE_TILE_STATUS.S3_VIRUS_SCAN_UPLOAD_ERROR
  ]
  const { isCancelable, status } = showProgressFile
  if (ERROR_STATUS.includes(status)) {
    return 'fileProgressModal.thisFileIsWaitingDelete'
  }
  if (isCancelable) {
    return 'fileProgressModal.thisFileIsTilingCancelable'
  }
  switch (status) {
    case FILE_UPLOAD_STATUS.CANCELLED:
      return 'fileProgressModal.thisFileIsCancelledUpload'
    case FILE_UPLOAD_STATUS.WAITING:
      return 'fileProgressModal.thisFileIsWaitingUpload'
    case FILE_UPLOAD_STATUS.UPLOADING:
      return 'fileProgressModal.thisFileIsUploading'
    case FILE_UPLOAD_STATUS.DONE:
      return 'fileProgressModal.thisFileHasFinishedUpload'
    default:
      if (
        status === FILE_TILE_STATUS.CONVERTING ||
        status === FILE_TILE_STATUS.CONVERTED
      ) {
        return 'fileProgressModal.thisFileIsTiling'
      } else {
        return 'fileProgressModal.thisFileIsWaitingTile'
      }
  }
}

const Component = (props: FileProgressModalItemProps) => {
  const { showProgressFile, cancelUpload, deleteFile, t } = props
  const { id, tempId, progress, isCancelable, status, name } = showProgressFile
  const isUploading = status === FILE_UPLOAD_STATUS.UPLOADING
  const isError = status === FILE_TILE_STATUS.DELETE_WAIT_ERROR
  // 削除アイコン連打防止用フラグ
  const [isDeleting, setDeleting] = useState(false)

  return (
    <>
      <TextArea>{name}</TextArea>
      <TextArea isError={isError}>{t(buildI18nKey(showProgressFile))}</TextArea>
      <Flex>
        <BarChart
          layout='vertical'
          width={500}
          height={25}
          barCategoryGap={0}
          barGap={0}
          margin={{ top: 5, right: 0, bottom: 0, left: 0 }}
          data={[{ progress }]}
        >
          <XAxis hide type='number' domain={[0, 100]} />
          <YAxis hide type='category' />
          <Bar
            dataKey='progress'
            fill={
              status === FILE_TILE_STATUS.CONVERTING ||
              status === FILE_TILE_STATUS.CONVERTED
                ? 'rgb(11, 211, 24)'
                : 'rgb(252, 175, 34)'
            }
            background={{ fill: '#eee' }}
          />
        </BarChart>
        <ProgressNumberArea>{`${progress || 0}%`}</ProgressNumberArea>
        {(isCancelable || isUploading || isError) && (
          <DeleteIconWrapper isDeleting={isDeleting}>
            <IconTrash
              onClick={() => {
                if (isDeleting) {
                  return
                }

                setDeleting(true)
                if (isUploading) {
                  tempId && cancelUpload(tempId)
                } else {
                  id && deleteFile(FILE_TYPE.ASSET, id)
                }
              }}
            />
          </DeleteIconWrapper>
        )}
      </Flex>
    </>
  )
}

export const FileProgressModalItem = React.memo<FileProgressModalItemProps>(
  Component
)
