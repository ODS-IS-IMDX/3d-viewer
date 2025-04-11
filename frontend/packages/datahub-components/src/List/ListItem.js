// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'

import theme from './theme'

export type ListItemProps = {}

export const ListItem = styled(Flex)`
  ${// $FlowFixMe
  themed('List.Item', theme.Item)}
`

// $FlowFixMe
ListItem.defaultProps = {
  alignItems: 'center'
}

export default ListItem
