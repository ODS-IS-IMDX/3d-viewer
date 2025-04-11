// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'
import { IconCurrentLocation } from '@ehv/datahub-icons'
import theme from './theme'

export type CurrentLocationButtonProps = {
  onClick: () => void
}

const iconStyle = {
  width: '45px',
  height: '45px',
  verticalAlign: 'middle',
  boxSizing: 'border-box'
}

const CurrentLocationButtonWrapper = styled(Box)`
  cursor: pointer;
  ${themed('MapNavigator.CurrentLocationButton', theme.CurrentLocationButton)}
`

/**
 * 現在地ボタン
 */
export function CurrentLocationButton ({
  ...props
}: CurrentLocationButtonProps) {
  return (
    <CurrentLocationButtonWrapper {...props}>
      <IconCurrentLocation style={iconStyle} />
    </CurrentLocationButtonWrapper>
  )
}

export default CurrentLocationButton
