// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, Text, themed } from '@ehv/design-system'

import theme from './theme'

export type ContextMenuItemProps = {
  label?: string,
  variant: string,
  children: React.Node
}

const ContextMenuItemWrapper = styled(Flex)`
  cursor: pointer;
  ${// $FlowFixMe
  themed('ContextMenu.Item', theme.Item)}
`

const ContextMenuItemLabel = styled(Text)`
  line-height: 1.36;
  ${// $FlowFixMe
  themed('ContextMenu.Item.Label', theme.Item.Label)}
`

export const ContextMenuItem = ({
  children,
  label,
  variant,
  ...props
}: ContextMenuItemProps) => (
  <ContextMenuItemWrapper {...props} px={4} py={2}>
    {label && (
      <ContextMenuItemLabel size={1} variant={variant}>
        {label}
      </ContextMenuItemLabel>
    )}
    {children}
  </ContextMenuItemWrapper>
)

export default ContextMenuItem
