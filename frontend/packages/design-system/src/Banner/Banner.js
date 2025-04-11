// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'

import Flex from '../Flex'
import { themed } from '../utils'

export const theme = {
  backgroundColor: '#ffffff'
}

export const Banner = styled(Flex)`
  border-radius: 6px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.15);
  ${themed('Banner', theme)}
`

Banner.defaultProps = {
  p: 3,
  alignItems: 'center'
}

Banner.displayName = 'Banner'
