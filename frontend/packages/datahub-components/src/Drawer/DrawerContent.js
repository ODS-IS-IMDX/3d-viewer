// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { themed } from '@ehv/design-system'
import { BaseStyle } from '../Style'

import theme from './theme'

export const DrawerContent = styled.div`
  ${props =>
    !props.isMobile ? BaseStyle : 'overflow-x: overlay; overflow-y: overlay;'}

  flex: 1;
  ${// $FlowFixMe
  themed('Drawer.Content', theme.Content)}
`

export default DrawerContent
