// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { Text } from '@ehv/design-system'
import styled, { css } from 'styled-components'

export type DropdownSingleValueProps = {
  children: React.Node,
  isDisabled: boolean
}

const TextWrapper = styled(Text)`
  ${({ isDisabled }) =>
    !!isDisabled &&
    css`
      cursor: not-allowed;
      color: #606770;
    `}
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: normal;
`

const DropdownSingleValue = ({
  children,
  isDisabled
}: DropdownSingleValueProps) => (
  <TextWrapper size={12} isDisabled={isDisabled}>
    {children}
  </TextWrapper>
)

export default DropdownSingleValue
