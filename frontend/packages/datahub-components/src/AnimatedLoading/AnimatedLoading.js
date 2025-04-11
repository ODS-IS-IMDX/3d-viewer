// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import styled from 'styled-components'

import { IconLoading } from '@ehv/datahub-icons'
import { Backdrop, Overlay } from '@ehv/design-system'

const Loading = styled(IconLoading)`
  animation: rotate 1s infinite;

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  margin: auto;
`

export const AnimatedLoading = () => {
  return (
    <Backdrop zIndex={99999}>
      <Overlay>
        <Loading />
      </Overlay>
    </Backdrop>
  )
}
