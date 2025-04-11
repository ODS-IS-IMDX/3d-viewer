// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'
import { IconOrganisation } from '@ehv/datahub-icons'
import { Dropdown } from './Dropdown'

import theme from './theme'

export type DropdownWithIconProps = {
  className?: string,
  isDisabled: boolean,
  name: string,
  placeholder: string
}

const DropdownWithIconWrapper = styled(Flex)`
  justify-content: center;
`

const Icons = {
  organisation: styled(IconOrganisation)`
    ${// $FlowFixMe
    themed('Dropdown.Icon', theme.Icon)}
  `
}

const StyledDropdown = styled(Dropdown)`
  margin-left: -4px;
  width: 182px;
`

export const DropdownWithIcon = ({
  className,
  name,
  ...props
}: DropdownWithIconProps) => {
  const Icon = Icons[name]
  return (
    <DropdownWithIconWrapper className={className}>
      <Icon />
      <StyledDropdown name={name} {...props} />
    </DropdownWithIconWrapper>
  )
}
