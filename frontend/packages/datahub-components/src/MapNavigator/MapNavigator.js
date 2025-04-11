// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'

import theme from './theme'
import { HomeButton } from './HomeButton'
import { ZoomInOut } from './ZoomInOut'
import { Compass } from './Compass'
import { CurrentLocationButton } from './CurrentLocationButton'

export type MapNavigatorProps = {
  onHomeClick: () => void,
  onZoomInClick: () => void,
  onZoomOutClick: () => void,
  onCurrentLocationClick: () => void,
  rotation: number,
  isMobile: boolean
}

const MapNavigatorWrapper = styled(Flex)`
  > *:not(:last-child) {
    margin-bottom: 12px;
  }
  ${// $FlowFixMe
  themed('MapNavigator.Control', theme.Control)}
`

export function MapNavigator ({
  onResetViewDoubleClick,
  onHomeClick,
  onZoomInClick,
  onZoomOutClick,
  /** 現在地ボタンクリックイベント */
  onCurrentLocationClick,
  onRotate,
  rotation,
  onTiltStart,
  onTiltMove,
  onTiltEnd,
  isMobile,
  ...props
}: MapNavigatorProps) {
  return (
    <MapNavigatorWrapper flexDirection='column' {...props}>
      <Compass rotation={rotation} />
      {!isMobile && <HomeButton onClick={onHomeClick} />}
      <CurrentLocationButton onClick={onCurrentLocationClick} />
      {!isMobile && (
        <ZoomInOut
          onZoomInClick={onZoomInClick}
          onZoomOutClick={onZoomOutClick}
        />
      )}
    </MapNavigatorWrapper>
  )
}

export default MapNavigator
