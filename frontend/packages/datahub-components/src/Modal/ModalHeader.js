// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { themed, Box } from '@ehv/design-system'

import theme from './theme'

export const ModalHeader = styled(Box)`
  flex-shrink: 0;
  ${// $FlowFixMe
  themed('Modal.Header', theme.Header)}
`

export default ModalHeader
