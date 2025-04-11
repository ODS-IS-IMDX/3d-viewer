// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'

import Text from '../Text'
import { themed } from '../utils'

export const theme = {
  color: '#16ABE3'
}

export const Link = styled(Text).attrs({
  as: 'a',
  target: '_blank'
})`
  cursor: pointer;
  text-decoration: none;
  ${themed('Link', theme)}
`
