// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { themed } from '@ehv/design-system'
import { BaseStyle } from '../Style'

import theme from './theme'

export const AccordionItemContent = styled.div`
  ${props =>
    !props.isMobile ? BaseStyle : 'overflow-x: overlay; overflow-y: overlay;'}

  height: 100%;
  ${// $FlowFixMe
  ({ expanded }) => (expanded ? 'display: block' : 'display: none')}
  ${// $FlowFixMe
  themed('Accordion.Item.Content', theme.Item.Content)}
`

export default AccordionItemContent
