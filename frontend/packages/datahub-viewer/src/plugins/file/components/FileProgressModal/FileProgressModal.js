// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useEffect } from 'react'
import { Modal } from '@ehv/datahub-components'
import { ModalHeader, ModalFooter } from '../common-components'
import { FileProgressModalList } from './FileProgressModalList'

import type { TFunction } from 'react-i18next'

type FileProgressModalProps = {
  close: () => void,
  pollingTilingFilesProgress: () => void,
  stopPollingTilingFilesProgress: () => void,
  t: TFunction
}

const Component = (props: FileProgressModalProps) => {
  const {
    close,
    pollingTilingFilesProgress,
    stopPollingTilingFilesProgress,
    t
  } = props

  useEffect(() => {
    pollingTilingFilesProgress()
    return stopPollingTilingFilesProgress
  }, [pollingTilingFilesProgress, stopPollingTilingFilesProgress])

  return (
    <Modal
      header={() => <ModalHeader headerText={t('fileProgressModal.title')} />}
      footer={() => (
        <ModalFooter
          leftButton={{
            label: t('fileProgressModal.buttonLabel'),
            onClick: close
          }}
        />
      )}
      closeButton={false}
    >
      <FileProgressModalList />
    </Modal>
  )
}

export const FileProgressModal = React.memo<FileProgressModalProps>(Component)
