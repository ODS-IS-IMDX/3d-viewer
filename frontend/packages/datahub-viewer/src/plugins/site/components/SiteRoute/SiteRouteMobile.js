// Copyright (c) 2025 NTT InfraNet
// @flow

import React from 'react'
import styled from 'styled-components'
import { Box, Flex } from '@ehv/datahub-components'
import { Slot } from '@ehv/react-slots'

import SiteDrawerSlot from '../SiteDrawerSlot'
import SiteMenu from '../SiteMenu'
import SiteViewer from '../SiteViewer'
import { type SiteProps, SiteRouter } from './SiteRoute'

export type SiteMobileProps = SiteProps

const HeaderPanel = styled(Flex)`
  z-index: 99990; // required for the box-shadow to work
  box-shadow: 0px 0px 6px 5px rgba(0, 0, 0, 0.15);
  width: 100%;
`
export const SiteRouteMobile = ({ isSiteOpen, ...props }: SiteMobileProps) => {
  return (
    <Flex flexDirection='column' height='100vh'>
      <HeaderPanel>
        <SiteMenu />
        <Slot name='core.navbar' />
      </HeaderPanel>
      <Box
        flex={1}
        style={{ position: 'relative', height: '100%', overflow: 'hidden' }}
      >
        <Slot name='site.viewer' />
        {isSiteOpen ? <SiteViewer /> : <></>}
        <SiteDrawerSlot />
      </Box>
      <SiteRouter />
    </Flex>
  )
}

export default SiteRouteMobile
