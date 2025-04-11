// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'

import theme from './theme'

const Divider = styled(Box)`
  ${// $FlowFixMe
  themed('ContextMenuWithHook.Divider', theme.Divider)}
`

Divider.defaultProps = {
  mx: 4,
  my: 2
}

export default Divider
