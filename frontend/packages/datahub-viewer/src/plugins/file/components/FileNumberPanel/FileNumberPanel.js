// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { Box, ComponentWithModal, Text } from '@ehv/datahub-components'
import { FileProgressModal } from '../FileProgressModal'

import type { TFunction } from 'react-i18next'

type FileNumberPanelProps = {|
  tileNumber: number,
  needUploadNumber: number,
  errorNumber: number,
  t: TFunction
|}

const ProcessingPanel = styled(Box)`
  height: 25px;
  line-height: 25px;
  cursor: pointer;
  background: rgb(11, 211, 24);
  text-align: center;
`
const ErrorPanel = styled(ProcessingPanel)`
  background: red;
`

export const Component = (props: FileNumberPanelProps) => {
  const { tileNumber, needUploadNumber, errorNumber, t } = props
  const hasNoFile = tileNumber + needUploadNumber + errorNumber === 0
  if (hasNoFile) {
    return null
  }

  return (
    <ComponentWithModal modal={props => <FileProgressModal {...props} />}>
      {({ openModal }) => (
        <>
          <ProcessingPanel onClick={openModal}>
            <Text fontSize={14}>
              {`${t('fileNumberPanel.uploading')}${needUploadNumber} | ${t(
                'fileNumberPanel.tiling'
              )}${tileNumber}`}
            </Text>
          </ProcessingPanel>
          {errorNumber > 0 && (
            <ErrorPanel onClick={openModal}>
              <Text fontSize={14}>{`${t(
                'fileNumberPanel.error'
              )}${errorNumber}`}</Text>
            </ErrorPanel>
          )}
        </>
      )}
    </ComponentWithModal>
  )
}

export const FileNumberPanel = React.memo<FileNumberPanelProps>(Component)
