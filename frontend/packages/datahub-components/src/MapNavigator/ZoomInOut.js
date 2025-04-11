// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, Hr, themed } from '@ehv/design-system'

import theme from './theme'
import { ZoomIn } from './ZoomIn'
import { ZoomOut } from './ZoomOut'

type ZoomInOutProps = {
  onZoomInClick: () => void,
  onZoomOutClick: () => void
}

const ZoomInOutWrapper = styled(Flex)`
  ${// $FlowFixMe
  themed('MapNavigator.ZoomInOut', theme.ZoomInOut)}
`

const HrWrapper = styled(Flex)`
  width: 100%;
  background-color: rgba(0, 0, 0, 0.75);
`

const Line = styled(Hr)`
  margin: 0;
  width: 84%;
  height: 1px;
  background-color: #dadada;
  border: none;
`

export function ZoomInOut ({ ...props }: ZoomInOutProps) {
  const { onZoomInClick, onZoomOutClick } = props
  return (
    <ZoomInOutWrapper flexDirection='column'>
      <ZoomIn onClick={onZoomInClick} />
      <HrWrapper justifyContent='center'>
        <Line noshade />
      </HrWrapper>
      <ZoomOut onClick={onZoomOutClick} />
    </ZoomInOutWrapper>
  )
}

export default ZoomInOut
