// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Flex, List, Modal } from '@ehv/datahub-components'
import { MAX_UPLOAD_FILE_NAME_LENGTH, MODAL_TYPE } from 'plugins/file/constants'
import { DeleteModal } from 'components'
import { FileListItem } from './FileListItem'
import { ModalHeader, ModalFooter } from '../common-components'

import type { TFunction } from 'react-i18next'
import type { UploadFile } from 'plugins/file/reducer'
import type {
  FileDeleteFileFromListAction,
  FileClearPrepareFilesAction,
  FileSelectFileAction,
  FileStartWatchUploadFileAction,
  FileUploadFilesAction
} from 'plugins/file/actions'

type FileListModalProps = {|
  fileList: Array<UploadFile>,
  close: () => void,
  deleteFileFromList: (index: number) => FileDeleteFileFromListAction,
  clearPrepareFiles: () => FileClearPrepareFilesAction,
  selectFile: () => FileSelectFileAction,
  setModalType: (modalType: string) => void,
  startWatchUploadFile: () => FileStartWatchUploadFileAction,
  uploadFiles: () => FileUploadFilesAction,
  t: TFunction
|}

const FileList = styled(List)`
  min-height: 255px;

  &:active {
    background-color: white;
  }
`

const WarningMessageBox = styled(Flex)`
  color: red;
`

const FileListModalComponent = (props: FileListModalProps) => {
  const {
    fileList,
    close,
    deleteFileFromList,
    clearPrepareFiles,
    selectFile,
    setModalType,
    startWatchUploadFile,
    uploadFiles,
    t
  } = props

  useEffect(() => {
    // fileListにstatusを持たない要素(つまりアップロードする前のファイル)がない場合、ファイル選択画面に戻す
    !fileList.find(file => !file.status) && setModalType(MODAL_TYPE.FILE_INPUT)
  }, [fileList, setModalType])

  const [deleteIndex, setDeleteIndex] = useState(-1)
  const [isDeleteConfirm, setDeleteConfirm] = useState(false)

  const isNotAllFilesSetParam = !!fileList.find(file => !file.info)

  const fileNameList = fileList.map(file => file.name)
  const hasTooLongNameInList =
    fileNameList.filter(
      fileName => MAX_UPLOAD_FILE_NAME_LENGTH < [...fileName].length
    ).length > 0
  const hasWarning = !!fileList.find(
    file => file.warning && Object.keys(file.warning).length > 0
  )

  const isDisableUpload =
    isNotAllFilesSetParam || hasTooLongNameInList || hasWarning

  return isDeleteConfirm ? (
    <DeleteModal
      message={`[${fileList[deleteIndex].name}]: ${t(
        'fileListModal.deleteConfirm.message'
      )}`}
      onCancelClick={() => setDeleteConfirm(false)}
      onDeleteClick={() => {
        deleteFileFromList(deleteIndex)
        setDeleteConfirm(false)
      }}
    />
  ) : (
    <Modal
      header={() => (
        <ModalHeader
          headerText={t('fileListModal.title')}
          headerButton={{
            label: t('fileListModal.buttonLabel.multiRegister'),
            onClick: () => setModalType(MODAL_TYPE.FILE_MULTI_REGISTER)
          }}
        />
      )}
      footer={() => (
        <ModalFooter
          leftButton={{
            label: t('fileListModal.buttonLabel.cancel'),
            onClick: () => {
              clearPrepareFiles()
              close()
            }
          }}
          rightButton={{
            disabled: isDisableUpload,
            label: t('fileListModal.buttonLabel.upload'),
            onClick: () => {
              uploadFiles()
              startWatchUploadFile()
              close()
            }
          }}
        />
      )}
      closeButton={false}
      style={{ width: '720px' }}
    >
      <FileList>
        {fileList.map(
          (file, index) =>
            !file.status && (
              <FileListItem
                key={file.fullPath}
                file={file}
                index={index}
                isTooLongName={
                  [...file.name].length > MAX_UPLOAD_FILE_NAME_LENGTH
                }
                setDeleteConfirm={setDeleteConfirm}
                setDeleteIndex={setDeleteIndex}
                selectFile={selectFile}
                setModalType={setModalType}
                t={t}
              />
            )
        )}
        {hasTooLongNameInList && (
          <WarningMessageBox justifyContent='center'>
            {t('fileListModal.hasTooLongNameMessage')}
          </WarningMessageBox>
        )}
      </FileList>
    </Modal>
  )
}

export const FileListModal = React.memo<FileListModalProps>(
  FileListModalComponent
)
