// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { themed, Box } from '@ehv/design-system'

import theme from './theme'

export const ModalFooter = styled(Box)`
  flex-shrink: 0;
  ${// $FlowFixMe
  themed('Modal.Footer', theme.Footer)}
`

export default ModalFooter
