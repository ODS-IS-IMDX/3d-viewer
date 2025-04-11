// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import { themed } from '@ehv/design-system'
import { TabPanel as ReactTabPanel } from 'react-tabs'

import theme from './theme'

const TabPanel = styled(ReactTabPanel)`
  display: none;
  margin-top: -4px;

  &.is-selected {
    display: block;
  }

  ${// $FlowFixMe
  themed('Tabs.TabPanel', theme.TabPanel)}
`

TabPanel.tabsRole = 'TabPanel'

export default TabPanel
