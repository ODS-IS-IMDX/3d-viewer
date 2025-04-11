// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import styled from 'styled-components'
import { themed } from '@ehv/design-system'
import { Tabs as ReactTabs, TabList as ReactTabList } from 'react-tabs'

import theme from './theme'
import Tab from './Tab'
import TabPanel from './TabPanel'

export type TabsProps = {
  tabs: Array<React.Element<typeof Tab>>,
  children: Array<React.Element<typeof TabPanel>>
}

export const TabsWrapper = styled(ReactTabs)`
  ${// $FlowFixMe
  themed('Tabs', theme)}
`

const TabList = styled(ReactTabList)`
  padding: 4px 20px;
  display: flex;
  margin: 0;
  ${// $FlowFixMe
  themed('Tabs.List', theme)}
`

TabList.tabsRole = 'TabList'

export class Tabs extends React.PureComponent<TabsProps> {
  static Tab = Tab
  static TabPanel = TabPanel

  render () {
    const { tabs, children, ...props } = this.props
    return (
      <TabsWrapper
        {...props}
        selectedTabClassName='is-selected'
        selectedTabPanelClassName='is-selected'
      >
        <TabList>{tabs}</TabList>
        {React.Children.map(
          children,
          (child, index) =>
            child &&
            React.cloneElement(child, {
              index
            })
        )}
      </TabsWrapper>
    )
  }
}
