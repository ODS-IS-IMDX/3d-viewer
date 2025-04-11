// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import { IconMapMore } from '@ehv/datahub-icons'
import { Box, themed } from '@ehv/design-system'

import theme from './theme'

const MapMoreWrapper = styled(Box).attrs(({ open }) => ({
  style: {
    opacity: open ? 1 : 0.75
  }
}))`
  width: 45px;
  height: 45px;
  cursor: pointer;
  border-radius: 50%;
  ${// $FlowFixMe
  themed('MapMore', theme)}
`

export type MapMoreProps = {
  open: boolean
}

export const MapMore = (props: MapMoreProps) => (
  <MapMoreWrapper {...props}>
    <IconMapMore />
  </MapMoreWrapper>
)

export default MapMore
