// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { Box, themed } from '@ehv/design-system'

import theme from './theme'
import { IconCompassTargetDefault } from '@ehv/datahub-icons'

export type MobileMapNavigatorProps = {
  onResetView: () => void
}

const MobileMapNavigatorWrapper = styled(Box)`
  ${// $FlowFixMe
  themed('MapNavigator.Mobile', theme.Mobile)}
`

export function MobileMapNavigator ({
  onResetView,
  ...props
}: MobileMapNavigatorProps) {
  return (
    <MobileMapNavigatorWrapper {...props}>
      <IconCompassTargetDefault onClick={onResetView} />
    </MobileMapNavigatorWrapper>
  )
}

export default MobileMapNavigator
