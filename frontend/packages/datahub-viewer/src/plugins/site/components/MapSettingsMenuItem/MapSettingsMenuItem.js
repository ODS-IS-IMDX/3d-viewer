// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { ContextMenu } from '@ehv/datahub-components'

export const MapSettingsMenuItem = styled(ContextMenu.Item)`
  padding: 10px 35px;

  * {
    font-size: 12px;
  }

  &:hover {
    cursor: default;
    background-color: #fff;
  }
`
export default MapSettingsMenuItem
