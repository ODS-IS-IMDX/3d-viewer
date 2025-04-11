// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { DeleteModal } from 'components'
import { FILE_TYPE } from 'plugins/file/constants'

import type { TFunction } from 'react-i18next'
import type { Asset, AssetID } from 'plugins/asset/reducer'
import type { FileDeleteFile } from 'plugins/file/actions'

type FileDeleteConfirmModalProps = {|
  file: Asset,
  fileType: string,
  deleteFile: (fileType: string, id: AssetID) => FileDeleteFile,
  close: (event: MouseEvent) => void,
  t: TFunction
|}

const Modal = (props: FileDeleteConfirmModalProps) => {
  const { file, fileType, deleteFile, close, t } = props
  const { name, id } = file

  if (!Object.values(FILE_TYPE).includes(fileType)) {
    return null
  }

  const handleDeleteClick = event => {
    deleteFile(fileType, id)
    close(event)
  }

  return (
    <DeleteModal
      zIndex={9999999}
      message={`${name}\n\n${t('fileDeleteModal.confirmMessage')}`}
      onCancelClick={event => {
        event.stopPropagation()
        close(event)
      }}
      onDeleteClick={event => {
        event.stopPropagation()
        handleDeleteClick(event)
      }}
    />
  )
}

export const FileDeleteConfirmModal = React.memo<FileDeleteConfirmModalProps>(
  Modal
)
