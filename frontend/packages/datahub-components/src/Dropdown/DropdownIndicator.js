// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'
import theme from './theme'
import { IconGroupCollapse, IconGroupExpand } from '@ehv/datahub-icons'

export type DropdownIndicatorProps = {
  children: React.Node,
  innerProps: Object,
  selectProps: {
    menuIsOpen?: Boolean,
    isDisabled?: boolean
  }
}

const DropdownIndicatorWrapper = styled(Flex)`
  ${// $FlowFixMe
  themed('Dropdown.Control.Dropdown', theme.Control.Dropdown)}
`

const DropdownIndicator = ({
  children,
  innerProps,
  selectProps: { menuIsOpen, isDisabled }
}: DropdownIndicatorProps) => {
  return isDisabled ? (
    <></>
  ) : (
    <DropdownIndicatorWrapper {...innerProps}>
      {menuIsOpen ? <IconGroupCollapse /> : <IconGroupExpand />}
      {children}
    </DropdownIndicatorWrapper>
  )
}

export default DropdownIndicator
