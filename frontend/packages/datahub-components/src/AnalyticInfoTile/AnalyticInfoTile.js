// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, Flex, Text, themed } from '@ehv/design-system'

import theme from './theme'

type AnalyticInfoTileProps = {
  empty?: boolean,
  title: string,
  value: string,
  description?: string,
  additional?: React.Node
}

const TileWrapper = styled(Flex)`
  flex: 1;
  ${// $FlowFixMe
  themed('AnalyticInfoTile.TileWrapper', theme.TileWrapper)}
`

const Title = styled(Text).attrs({
  size: '1'
})`
  margin: 16px 16px 0 16px;
  ${// $FlowFixMe
  themed('AnalyticInfoTile.Title', theme.Title)}
`
const Value = styled(Text).attrs({
  size: '7'
})`
  margin: 8px 16px 0 16px;
  ${// $FlowFixMe
  themed('AnalyticInfoTile.Value', theme.Value)}
`
const Description = styled(Text).attrs({
  size: '1'
})`
  margin: 8px 16px 0 16px;
  ${// $FlowFixMe
  themed('AnalyticInfoTile.Value', theme.Value)}
`

export const AnalyticInfoTile = ({
  title,
  value,
  description,
  additional,
  empty = false
}: AnalyticInfoTileProps) => (
  <TileWrapper>
    {!empty && (
      <>
        <Box flex='1'>
          <Title>{title}</Title>
          <Value>{value}</Value>
          {description && <Description>{description}</Description>}
        </Box>
        {additional}
      </>
    )}
  </TileWrapper>
)
