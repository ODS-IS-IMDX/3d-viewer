// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'
import theme from './theme'

export type DropdownControlProps = {
  children: React.Node,
  innerRef(): void,
  innerProps: Object,
  menuIsOpen?: boolean
}

const DropdownControlWrapper = styled(Flex)`
  ${// $FlowFixMe
  themed('Dropdown.Control', theme.Control)};
`

const DropdownControl = ({
  children,
  innerRef,
  innerProps,
  menuIsOpen
}: DropdownControlProps) => (
  <DropdownControlWrapper ref={innerRef} {...innerProps} isFocused={menuIsOpen}>
    {children}
  </DropdownControlWrapper>
)

export default DropdownControl
