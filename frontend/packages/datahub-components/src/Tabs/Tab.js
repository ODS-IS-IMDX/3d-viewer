// Copyright (c) 2025 NTT InfraNet
import styled from 'styled-components'
import { themed } from '@ehv/design-system'
import { Tab as ReactTab } from 'react-tabs'

import theme from './theme'

const Tab = styled(ReactTab)`
  align-items: center;
  display: flex;
  height: 34px;
  line-height: 1.29;
  margin: 4px 6px 0 0;
  padding: 0 34px;
  text-align: center;
  user-select: none;

  &.is-selected {
    border-radius: 2px 2px 0 0;
    background-color: #ffffff;
    height: 42px;
    margin: 0 6px 0 0;
    color: #000000;
  }

  ${// $FlowFixMe
  themed('Tabs.Tab', theme.Tab)}
`

Tab.tabsRole = 'Tab'

export default Tab
