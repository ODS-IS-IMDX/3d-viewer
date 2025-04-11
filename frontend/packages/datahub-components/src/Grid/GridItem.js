// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'

import theme from './theme'

export type GridItemProps = {}

export const GridItem = styled(Box)`
  cursor: pointer;
  ${// $FlowFixMe
  themed('Grid.Item', theme.Item)}
`

export default GridItem
