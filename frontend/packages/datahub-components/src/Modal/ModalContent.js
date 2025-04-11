// Copyright (c) 2025 NTT InfraNet
// @flow
import styled, { css } from 'styled-components'
import { themed, Box } from '@ehv/design-system'
import { BaseStyle } from '../Style'

import theme from './theme'

export const ModalContent = styled(Box)`
  ${props =>
    !props.isMobile ? BaseStyle : 'overflow-x: overlay; overflow-y: overlay;'}

  height: 100%;
  ${// $FlowFixMe
  themed('Modal.Content', theme.Content)}
  ${({ modalContentStyled }) =>
    modalContentStyled &&
    css`
      ${modalContentStyled}
    `}
`

export default ModalContent
