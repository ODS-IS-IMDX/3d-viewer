// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Flex, themed } from '@ehv/design-system'
import theme from './theme'
import { IconCompass } from '@ehv/datahub-icons'

const CompassWrapper = styled(Flex).attrs(({ rotation }) => ({
  style: {
    transform: `rotate(${rotation}deg)`
  }
}))`
  ${// $FlowFixMe
  themed('MapNavigator.Compass', theme.Compass)}
`

export type CompassProps = {
  rotation: number
}

export function Compass ({ ...props }: PureComponent<CompassProps, State>) {
  return (
    <CompassWrapper alignItems='center' justifyContent='center' {...props}>
      <IconCompass />
    </CompassWrapper>
  )
}

export default Compass
