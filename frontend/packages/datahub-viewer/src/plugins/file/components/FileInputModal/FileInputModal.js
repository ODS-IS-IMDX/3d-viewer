// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Button as DCButton,
  Modal,
  Text,
  UploadDND,
  Flex
} from '@ehv/datahub-components'
import { ALLOWED_EXTENSION_LIST, MODAL_TYPE } from 'plugins/file/constants'
import { getExtension } from 'utils/files'
import { ModalFooter } from '../common-components'
import { FORMAT_TYPE_EXTENSION_MAP } from '../../constants'
import type { TFunction } from 'react-i18next'
import type { UploadFile } from 'plugins/file/reducer'
import type { FilePutFilesIntoStateAction } from 'plugins/file/actions'
import { IconQuestionCircleRegular } from '@ehv/datahub-icons'

type FileInputModalProps = {|
  close: () => void,
  putFilesIntoState: (files: Array<UploadFile>) => FilePutFilesIntoStateAction,
  setModalType: (modalType: string) => void,
  t: TFunction
|}

const UploadFileBoxWrapper = styled(Box)`
  box-sizing: border-box;
  border: dashed 2px #d8d8d8;
  background-color: #f6f6f6;
  border-radius: 6px;
  color: #606770;
  height: 150px;
  margin: 20px 50px;
`

const ButtonsAreaWrapper = styled(Flex)`
  margin: 20px 50px;
`
const Button = styled(DCButton)`
  height: 50px;
  width: 240px;
  border-radius: 5px;
`

const iconStyle = {
  height: '15px',
  verticalAlign: 'middle',
  margin: '0px 0px 3px 5px',
  color: '#3a4248',
  cursor: 'pointer'
}

const onSelectClick = (isDirectory: boolean) => {
  const fileInputElement: HTMLInputElement = (document.getElementById(
    'uploadfile'
  ): any)
  // $FlowIgnore[prop-missing]
  fileInputElement.webkitdirectory = isDirectory
  fileInputElement.multiple = true
  fileInputElement.value = ''
  fileInputElement.click()
}

const FileInputModalComponent = (props: FileInputModalProps) => {
  const { close, putFilesIntoState, setModalType, t } = props

  const onAddFiles = (files: Array<UploadFile>) => {
    const filteredFiles = files.filter(file =>
      ALLOWED_EXTENSION_LIST.includes(getExtension(file.name))
    )
    if (filteredFiles.length === 0) {
      return
    }
    putFilesIntoState(filteredFiles)
    setModalType(MODAL_TYPE.FILE_LIST)
  }

  const showTooltip = () => {
    let toolTip = t('fileInputModal.tooltip') + '\n'
    FORMAT_TYPE_EXTENSION_MAP.forEach(function (value, key) {
      toolTip +=
        key + ' (' + value.map(extension => `.${extension}`).join(', ') + ')\n'
    })
    return toolTip
  }

  /** 許可する拡張子の作成 */
  const createAcceptedTypes = () =>
    ALLOWED_EXTENSION_LIST.map(extension => `.${extension}`).join(',')

  return (
    <Modal
      header={() => (
        <Modal.Header variant='default' height={80}>
          <Flex flex={2}>
            <Text fontSize={12} lineHeight={3} fontWeight={600} color='#606770'>
              {t('fileInputModal.title')}
            </Text>
            <div className='rootTooltip' style={{ lineHeight: '35px' }}>
              <IconQuestionCircleRegular style={iconStyle} />
              <div className='tooltip'>{showTooltip()}</div>
            </div>
          </Flex>
        </Modal.Header>
      )}
      footer={() => (
        <ModalFooter
          rightButton={{
            label: t('fileInputModal.cancelButtonLabel'),
            variant: 'outline',
            width: '110px',
            onClick: close
          }}
        />
      )}
      closeButton={false}
      onClose={null}
      variant='noPadding'
    >
      <UploadFileBoxWrapper>
        <UploadDND
          clickDisabled
          multiple
          onDND={onAddFiles}
          acceptedTypes={createAcceptedTypes()}
        >
          <Text size={1} style={{ textAlign: 'center', padding: '65px' }}>
            {t('fileInputModal.dropMessage.main')}
          </Text>
        </UploadDND>
      </UploadFileBoxWrapper>
      <Text size={1} style={{ textAlign: 'center' }}>
        {t('fileInputModal.dropMessage.sub')}
      </Text>
      <ButtonsAreaWrapper>
        <Button onClick={() => onSelectClick(true)}>
          {t('fileInputModal.dropMessage.selectFolder')}
        </Button>
        <Box flex={1} />
        <Button onClick={() => onSelectClick(false)}>
          {t('fileInputModal.dropMessage.selectFile')}
        </Button>
      </ButtonsAreaWrapper>
    </Modal>
  )
}

export const FileInputModal = React.memo<FileInputModalProps>(
  FileInputModalComponent
)
