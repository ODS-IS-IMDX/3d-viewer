// Copyright (c) 2025 NTT InfraNet
// @flow
import styled from 'styled-components'
import { Flex, Text, themed } from '@ehv/design-system'
import { IconMenuManageFleet, IconProductViewer } from '@ehv/datahub-icons'

import theme from './theme'

export const ToolTreeItem = styled(Flex)`
  align-items: center;
  text-decoration: none;
  margin-top: 16px;
`

export const ToolTreeItemText = styled(Text)`
  margin-left: 8px;
`

export const ToolTreeDisabledItemText = styled(ToolTreeItemText)`
  ${// $FlowFixMe
  themed('ToolTree.DisabledText', theme.DisabledText)}
`

export const ToolTreeTools = styled.div`
  margin-top: 5px;
  margin-left: 28px;
`

export const ToolTreeLine = styled.div`
  border-left: 1px dotted;
  border-bottom: 1px dotted;
  width: 11px;
  height: 50px;
  margin-bottom: -37px;
  margin-left: -10px;

  :nth-child(3) {
    position: relative;
    top: -20px;
    margin-bottom: -58px;
  }
`

export const IconUploader = styled(IconMenuManageFleet)`
  border-radius: 4px;
  ${// $FlowFixMe
  themed('ToolTree.EnabledIcon', theme.EnabledIcon)}
`

export const IconViewer = styled(IconProductViewer)`
  border-radius: 4px;
  ${// $FlowFixMe
  themed('ToolTree.EnabledIcon', theme.EnabledIcon)}
`
