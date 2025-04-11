// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import { Router } from '@reach/router'
import { Slot } from '@ehv/react-slots'
import { Box, Flex } from '@ehv/datahub-components'
import styled from 'styled-components'

import SiteMenu from '../SiteMenu'
import SiteViewer from '../SiteViewer'
import SiteDrawerSlot from '../SiteDrawerSlot'
import type { WithNamespaces } from 'react-i18next'
import SiteRouteMobile from './SiteRouteMobile'

export const SiteRouter = props => (
  <Slot name='site.router'>
    {fills => (
      <Router primary={false}>{fills.map(fill => fill.render())}</Router>
    )}
  </Slot>
)

const LeftPanel = styled(Flex)`
  z-index: 99990; // required for the box-shadow to work
  box-shadow: 0px 0px 6px 5px rgba(0, 0, 0, 0.15);
  height: 100%;
`

export type SiteProps = WithNamespaces & {
  siteId: string,
  isAdmin: Boolean,
  isSiteOpen: Boolean,
  isMobile: Boolean
}

export class SiteRoute extends PureComponent<SiteProps, State> {
  render () {
    return this.props.isMobile ? (
      <SiteRouteMobile {...this.props} />
    ) : (
      <Flex height='100vh'>
        <LeftPanel flexDirection='column' height='100%'>
          <SiteMenu />
          <Slot name='core.navbar' />
        </LeftPanel>
        <Box
          flex={1}
          style={{ position: 'relative', height: '100%', overflow: 'hidden' }}
        >
          <Slot name='site.viewer' />
          {this.props.isSiteOpen ? <SiteViewer /> : <></>}
          <SiteDrawerSlot />
        </Box>
        <SiteRouter />
      </Flex>
    )
  }
}
