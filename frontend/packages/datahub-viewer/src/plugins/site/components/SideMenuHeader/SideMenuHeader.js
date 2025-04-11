// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import type { WithNamespaces } from 'react-i18next'
import styled from 'styled-components'

import { Box, Flex, Text } from '@ehv/datahub-components'
import { IconTime } from '@ehv/datahub-icons'
import { themed } from '@ehv/design-system'

import theme from './theme'
import SideMenuHeaderMobile from './SideMenuHeaderMobile'

import type { Site } from '../../reducer'
import type { DataOpenDrawerAction } from 'plugins/data/actions'

export type SideMenuHeaderProps = {
  siteId: string,
  currentSite: Site,
  isLoading: boolean,
  isAssetDrawerOpen: boolean,
  isMobile: boolean,
  openTimeline: () => DataOpenDrawerAction,
  cancelEditAsset: () => void
} & WithNamespaces

const FlexWrapper = styled(Flex)`
  margin: 0 10px;
  padding: 2px;
  height: 70px;
  min-height: 70px;

  ${// $FlowFixMe
  themed('SideMenuHeader', theme.Default)}
`
const TextWrapper = styled(Text)`
  margin: 5px;
  font-size: 16px;
  font-weight: 700;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const IconWrapper = styled(Box)`
  position: relative;
  margin: 5px;
  width: 20px;
  height: 20px;
  cursor: pointer;

  &:hover .description {
    display: flex;
    justify-content: center;
    transform: translate(10px, 5px) translateX(-50%);
  }
`
const Tooltip = styled.div`
  display: none;
  position: fixed;
  padding: 8px;
  font-size: 12px;
  line-height: 1.6em;
  color: #fff;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.8);
  z-index: 2147483647;
  white-space: nowrap;
`

export class SideMenuHeader extends PureComponent<SideMenuHeaderProps, void> {
  render () {
    const {
      props,
      props: {
        t,
        currentSite,
        isLoading,
        isAssetDrawerOpen,
        isMobile,
        openTimeline,
        cancelEditAsset
      }
    } = this

    const handleItemClick = () => {
      if (isAssetDrawerOpen) {
        cancelEditAsset()
      }
      openTimeline()
    }

    return isMobile ? (
      <SideMenuHeaderMobile {...props} />
    ) : (
      <FlexWrapper {...props} alignItems='center'>
        <TextWrapper>{isLoading ? t('loading') : currentSite.name}</TextWrapper>
        <IconWrapper onClick={handleItemClick}>
          <IconTime />
          <Tooltip className='description'>{t('menu.timeline')}</Tooltip>
        </IconWrapper>
      </FlexWrapper>
    )
  }
}

export default SideMenuHeader
