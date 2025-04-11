// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'

import theme from './theme'
import { IconZoomOut } from '@ehv/datahub-icons'

export type ZoomOutProps = {
  onClick: () => void
}

const iconStyle = {
  width: '41px'
}

const ZoomOutWrapper = styled(Box)`
  cursor: pointer;
  ${// $FlowFixMe
  themed('MapNavigator.ZoomInOut.ZoomOut', theme.ZoomInOut.ZoomOut)}
`

export function ZoomOut ({ ...props }: ZoomOutProps) {
  return (
    <ZoomOutWrapper {...props}>
      <IconZoomOut style={iconStyle} />
    </ZoomOutWrapper>
  )
}
