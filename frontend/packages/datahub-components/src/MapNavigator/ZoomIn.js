// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'

import theme from './theme'
import { IconZoomIn } from '@ehv/datahub-icons'

export type ZoomInProps = {
  onClick: () => void
}

const iconStyle = {
  width: '41px'
}

const ZoomInWrapper = styled(Box)`
  cursor: pointer;
  ${// $FlowFixMe
  themed('MapNavigator.ZoomInOut.ZoomIn', theme.ZoomInOut.ZoomIn)}
`

export function ZoomIn ({ ...props }: ZoomInProps) {
  return (
    <ZoomInWrapper {...props}>
      <IconZoomIn style={iconStyle} />
    </ZoomInWrapper>
  )
}

export default ZoomIn
