// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'

import { PopupMenu } from '../PopupMenu'
import theme from './theme'

type ImagerySettingsProps = {
  children: React.Node,
  onClose: () => void
}

const SettingsWrapper = styled(Box)`
  padding: 16px;
  width: 216px;
  height: 100%;
  border-radius: 6px;
  ${// $FlowFixMe
  themed('ImagerySettingsTheme', theme)}
`

export const ImagerySettings = ({
  children,
  onClose,
  ...props
}: ImagerySettingsProps) => (
  <PopupMenu onClose={onClose} {...props}>
    <SettingsWrapper>{children}</SettingsWrapper>
  </PopupMenu>
)
