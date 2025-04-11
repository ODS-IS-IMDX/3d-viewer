// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import type { WithNamespaces } from 'react-i18next'
import styled from 'styled-components'
import { ContextMenu } from '@ehv/datahub-components'

export type SettingContextMenuProps = {
  ...WithNamespaces,
  position: any,
  handleOpenCameraControlModal: (isOpen: boolean) => void
}

const ContextMenuWrapper = styled(ContextMenu)`
  z-index: 1;
`

export const SettingContextMenu = (props: SettingContextMenuProps) => {
  const { t, position, handleOpenCameraControlModal } = props
  return (
    <ContextMenuWrapper
      position={position}
      onClose={() => {}}
      isClosableByClick
    >
      <ContextMenu.Item
        onClick={handleOpenCameraControlModal}
        label={t('cameraConfig.label')}
        variant={''}
      >
        <></>
      </ContextMenu.Item>
    </ContextMenuWrapper>
  )
}

export default SettingContextMenu
