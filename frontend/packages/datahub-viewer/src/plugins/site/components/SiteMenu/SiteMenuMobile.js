// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'

import { Fixed, Flex } from '@ehv/datahub-components'
import { Slot } from '@ehv/react-slots'
import { type SiteMenuProps } from './SiteMenu'
import { SideBar } from '../SideBar'

export type SiteMenuMobileProps = SiteMenuProps

const SiteMenuWrapper = styled(Flex)`
  width: 100%;
`
const SiteMenuPanelWrapper = styled(Flex)`
  width: 100vw;
  background-color: #fff;
  opacity: 0.95;
`
const FillWrapper = styled.div`
  overflow: hidden auto;
`
export const SiteMenuMobile = ({
  activeIconName,
  openViewName,
  ...props
}: SiteMenuMobileProps) => {
  return (
    <SiteMenuWrapper flexDirection='column'>
      <SideBar />
      <Fixed top={60} left={0}>
        <Slot name='site.menu'>
          {fills => {
            return (
              <SiteMenuPanelWrapper flexDirection='column'>
                {fills
                  .filter(
                    fill =>
                      fill.props.type === activeIconName ||
                      fill.props.type === openViewName
                  )
                  .sort(
                    (
                      { props: { order: a = Number.MAX_VALUE } },
                      { props: { order: b = Number.MAX_VALUE } }
                    ) => a - b
                  )
                  .map((fill, index) => (
                    <FillWrapper key={index}>{fill.render()}</FillWrapper>
                  ))}
              </SiteMenuPanelWrapper>
            )
          }}
        </Slot>
      </Fixed>
    </SiteMenuWrapper>
  )
}

export default SiteMenuMobile
