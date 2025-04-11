// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'

import theme from './theme'
import { IconHome } from '@ehv/datahub-icons'

export type HomeButtonProps = {
  onClick: () => void
}

const iconStyle = {
  width: '45px',
  height: '45px',
  verticalAlign: 'middle',
  boxSizing: 'border-box'
}

const color = '#fff'

const HomeButtonWrapper = styled(Box)`
  cursor: pointer;
  ${// $FlowFixMe
  themed('MapNavigator.HomeButton', theme.HomeButton)}
`

export function HomeButton ({ ...props }: HomeButtonProps) {
  return (
    <HomeButtonWrapper {...props}>
      <IconHome style={iconStyle} color={color} />
    </HomeButtonWrapper>
  )
}

export default HomeButton
