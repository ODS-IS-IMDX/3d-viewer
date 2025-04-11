// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { components } from 'react-select'
import type { CommonProps } from 'react-select/lib/types'
import styled, { css } from 'styled-components'
import { themed } from '@ehv/design-system'
import { BaseStyle } from '../Style'

import theme from './theme'

export type DropdownMenuProps = CommonProps & {
  children: React.Node,
  maxMenuHeight: number,
  menuWidth?: string | number
}

const MenuWrapper = styled(components.Menu)`
  ${props =>
    !props.isMobile ? BaseStyle : 'overflow-x: overlay; overflow-y: overlay;'}

  margin-top: 0 !important;
  margin-bottom: 0 !important;

  ${({ maxMenuHeight }) =>
    maxMenuHeight > 0 &&
    css`
      max-height: ${maxMenuHeight}px;
    `}
  ${({ menuWidth }) =>
    menuWidth &&
    css`
      width: ${!isNaN(menuWidth) ? `${menuWidth}px` : menuWidth} !important;
    `}
  
  ${themed('Dropdown.Menu', theme.Menu)};
`

const DropdownMenu = ({
  children,
  maxMenuHeight,
  selectProps,
  ...rest
}: DropdownMenuProps) => (
  <MenuWrapper
    {...rest}
    maxMenuHeight={maxMenuHeight}
    menuWidth={selectProps.menuWidth}
  >
    {children}
  </MenuWrapper>
)

export default DropdownMenu
