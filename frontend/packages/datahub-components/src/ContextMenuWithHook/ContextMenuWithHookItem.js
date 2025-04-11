// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, Text, themed } from '@ehv/design-system'

import theme from './theme'

export type ContextMenuWithHookItemProps = {
  label?: string,
  variant?: string,
  children: React.Node
}

const ContextMenuWithHookItemWrapper = styled(Flex)`
  cursor: pointer;
  ${// $FlowFixMe
  themed('ContextMenu.Item', theme.Item)}
`

const ContextMenuWithHookItemLabel = styled(Text)`
  line-height: 1.36;
  ${// $FlowFixMe
  themed('ContextMenu.Item.Label', theme.Item.Label)}
`

export const ContextMenuWithHookItem = ({
  children,
  label,
  variant,
  ...props
}: ContextMenuWithHookItemProps) => (
  <ContextMenuWithHookItemWrapper {...props} px={4} py={2}>
    {label && (
      <ContextMenuWithHookItemLabel size={1} variant={variant}>
        {label}
      </ContextMenuWithHookItemLabel>
    )}
    {children}
  </ContextMenuWithHookItemWrapper>
)

export default ContextMenuWithHookItem
