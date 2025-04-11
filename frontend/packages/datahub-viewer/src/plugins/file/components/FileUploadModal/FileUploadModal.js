// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useState } from 'react'
import { FileInputModal } from '../FileInputModal'
import { FileListModal } from '../FileListModal'
import { FileRegisterModal } from '../FileRegisterModal'
import { MODAL_TYPE } from 'plugins/file/constants'

type FileUploadModalProps = {
  close: () => void
}

export const FileUploadModal = (props: FileUploadModalProps) => {
  const { close } = props
  const [modalType, setModalType] = useState(MODAL_TYPE.FILE_INPUT)

  switch (modalType) {
    case MODAL_TYPE.FILE_INPUT:
      return <FileInputModal close={close} setModalType={setModalType} />
    case MODAL_TYPE.FILE_LIST:
      return <FileListModal close={close} setModalType={setModalType} />
    case MODAL_TYPE.FILE_REGISTER:
      return <FileRegisterModal setModalType={setModalType} />
    case MODAL_TYPE.FILE_MULTI_REGISTER:
      return <FileRegisterModal setModalType={setModalType} isMultiInput />
    default:
      return null
  }
}
