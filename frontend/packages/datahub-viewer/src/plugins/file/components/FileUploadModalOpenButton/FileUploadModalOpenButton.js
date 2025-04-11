// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import type { TFunction } from 'react-i18next'
import styled from 'styled-components'
import { IconAdd } from '@ehv/datahub-icons'
import {
  ComponentWithModal,
  OverflowEllipsis,
  Button
} from '@ehv/datahub-components'

import { stopPropagation } from 'utils/events'
import { FileUploadModal } from '../FileUploadModal'

type FileUploadModalOpenButtonProps = {|
  isEnabled: boolean,
  onClose?: () => void,
  t: TFunction
|}

const ItemText = styled(OverflowEllipsis)`
  flex: 1;
  ${({ isDisabled }) => isDisabled && 'color: #8e96a0;'}
`
const OpenButton = styled(Button)`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 10px;
  color: #000;
  background-color: #fff;
  border: 1px solid #c4c4c4;
  border-radius: 5px;

  &:hover {
    background-color: #fff;
  }
`
const IconAddWrapper = styled.div`
  width: 20px;
  height: 20px;
  position: relative;
  margin-right: 4px;
  opacity: 0.8;
  svg {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`
export const FileUploadModalOpenButton = (
  props: FileUploadModalOpenButtonProps
) => {
  const { onClose, t } = props

  const handleClose = close => () => {
    close()
    onClose && onClose()
  }
  return (
    <ComponentWithModal
      modal={({ close }) => (
        <FileUploadModal close={handleClose(close)} {...props} />
      )}
    >
      {({ openModal }) => (
        <OpenButton onClick={stopPropagation(openModal)}>
          <IconAddWrapper>
            <IconAdd width={40} height={40} />
          </IconAddWrapper>
          <ItemText textAlign='left'>{t('menu.add')}</ItemText>
        </OpenButton>
      )}
    </ComponentWithModal>
  )
}
