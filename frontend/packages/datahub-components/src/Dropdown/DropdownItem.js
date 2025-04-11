// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled, { css } from 'styled-components'
import { Flex, Text, themed } from '@ehv/design-system'
import { BaseStyle } from '../Style'

import theme from './theme'

export type DropdownItemProps = {
  label: string,
  innerProps: Object,
  isFocused: boolean
}

// $FlowFixMe
const ItemWrapper = styled(Flex)`
  ${props =>
    !props.isMobile ? BaseStyle : 'overflow-x: overlay; overflow-y: overlay;'}

  ${// $FlowFixMe
  themed('Dropdown.Menu.List.Item', theme.Menu.List.Item)};
  ${({ isFocused }) =>
    isFocused &&
    css`
      background-color: #f6f6f6;
    `};
`

const StyledText = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: normal;
`

const DropdownItem = ({
  innerProps,
  label,
  isFocused,
  ...props
}: DropdownItemProps) => (
  <ItemWrapper alignItems='center' {...innerProps} isFocused={isFocused}>
    <StyledText size={14}>{label}</StyledText>
  </ItemWrapper>
)

export default DropdownItem
