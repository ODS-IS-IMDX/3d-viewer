// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, Fixed, themed } from '@ehv/design-system'

import ContextMenuWithHookItem from './ContextMenuWithHookItem'
import ContextMenuWithHookDivider from './ContextMenuWithHookDivider'

import theme from './theme'

export type ContextMenuWithHookProps = {
  children: React.Node,
  position: {
    top: number,
    left: number,
    right: number,
    bottom: number
  },
  width?: number,
  onClick?: () => void,
  onBlur?: () => void
}

export const ContextMenuWithHookWrapper = styled(Flex)`
  border-radius: 8px;
  flex-direction: column;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  ${// $FlowFixMe
  themed('ContextMenuWithHook', theme)}
`

export const ContextMenuWithHook = ({
  setIsMenuOpen,
  position,
  width = 184,
  children,
  onBlur,
  onClick,
  ...props
}: ContextMenuWithHookProps) => (
  <Fixed
    width={width}
    {...props}
    {...position}
    tabIndex='0'
    onBlur={onBlur}
    onClick={onClick}
    ref={ref => ref && ref.focus()}
    style={{ outline: 'none' }}
  >
    <ContextMenuWithHookWrapper width={1} py={2}>
      {children}
    </ContextMenuWithHookWrapper>
  </Fixed>
)

ContextMenuWithHook.Item = ContextMenuWithHookItem
ContextMenuWithHook.Divider = ContextMenuWithHookDivider

export default ContextMenuWithHook
