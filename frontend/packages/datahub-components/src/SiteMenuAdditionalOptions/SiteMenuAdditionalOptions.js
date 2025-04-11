// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'

import {
  additionalOptionsRightTheme,
  additionalOptionsWrapperTheme
} from './theme'

export const AdditionalOptionsWrapper = styled(Flex)`
  position: fixed;
  left: 248px;
  border-radius: 4px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  z-index: 999;
  width: 552px;
  height: 350px;
  top: 8px;
  ${// $FlowFixMe
  themed('AdditionalOptionsWrapper', additionalOptionsWrapperTheme)}
`

export const AdditionalOptionsLeft = styled.div`
  width: 254px;
  height: 350px;
`

export const AdditionalOptionsRight = styled.div`
  width: 298px;
  height: 350px;
  ${// $FlowFixMe
  themed('AdditionalOptionsRight', additionalOptionsRightTheme)}
`
