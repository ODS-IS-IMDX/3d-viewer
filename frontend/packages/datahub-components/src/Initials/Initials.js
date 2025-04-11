// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled, { css } from 'styled-components'
import { themed, Box } from '@ehv/design-system'

import theme from './theme'

type InitialsProps = {
  fullName: string
}

const InitialsWrapper = styled(Box)`
  min-width: 41px;
  width: 41px;
  height: 41px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  border-radius: 50px;
  border: 1px solid #f2f2f2;
  line-height: 39px;
  ${({ strikeThrough }) =>
    strikeThrough &&
    css`
      text-decoration: line-through;
    `}
  ${themed('Initials', theme)};
`

const getInitialsValue = (fullName: string): string =>
  fullName
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')

export const Initials = ({ fullName, ...props }: InitialsProps) => (
  <InitialsWrapper {...props}>{getInitialsValue(fullName)}</InitialsWrapper>
)
