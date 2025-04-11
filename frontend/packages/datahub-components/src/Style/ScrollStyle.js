// Copyright (c) 2025 NTT InfraNet
import { css } from 'styled-components'

export const ScrollStyle = css`
  overflow-x: ${props => (props.isMobile ? 'overlay' : 'hidden')};
  overflow-y: ${props => (props.isMobile ? 'overlay' : 'hidden')};
  &:hover {
    overflow-x: overlay;
    overflow-y: overlay;
  }
`
