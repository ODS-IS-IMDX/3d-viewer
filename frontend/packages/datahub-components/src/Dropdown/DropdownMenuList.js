// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { components } from 'react-select'
import type { CommonProps } from 'react-select/lib/types'
import styled from 'styled-components'
import { themed } from '@ehv/design-system'
import theme from './theme'

export type DropdownMenuListProps = CommonProps & {
  children: React.Node
}

const MenuListWrapper = styled(components.MenuList)`
  ${// $FlowFixMe
  themed('Dropdown.Menu.List', theme.Menu.List)}
`

const DropdownMenuList = ({ children, ...rest }: DropdownMenuListProps) => (
  <MenuListWrapper {...rest}>{children}</MenuListWrapper>
)

DropdownMenuList.defaultProps = {
  variant: 'default'
}

export default DropdownMenuList
