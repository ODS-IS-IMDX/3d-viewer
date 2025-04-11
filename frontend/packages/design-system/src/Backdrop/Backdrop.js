// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'

import Fixed from '../Fixed'

export const Backdrop = styled(Fixed)`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  text-align: center;

  &:before {
    content: '';
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`

Backdrop.defaultProps = {
  bg: 'rgba(0,0,0,0.8)'
}

Backdrop.displayName = 'Backdrop'
