// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Box, Flex, Text } from '@ehv/datahub-components'
import { IconTime } from '@ehv/datahub-icons'

import { type SideMenuHeaderProps } from '../SideMenuHeader'

export type SideMenuHeaderMobileProps = SideMenuHeaderProps

const FlexWrapper = styled(Flex)`
  margin: 0 8px 0 20px;
  padding: 2px;
  height: 68px;
  min-height: 68px;
`
const TextWrapper = styled(Text)`
  margin: 5px;
  font-size: 20px;
  font-weight: 700;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`
const IconWrapper = styled(Box)`
  position: relative;
  margin: 10px;
  width: 24px;
  height: 24px;
  cursor: pointer;

  &:hover .description {
    display: flex;
    justify-content: center;
    transform: translate(12px, 6px) translateX(-50%);
  }
`
export class SideMenuHeaderMobile extends PureComponent<
  SideMenuHeaderMobileProps,
  void
> {
  render () {
    const {
      props,
      props: { t, currentSite, isLoading, openTimeline }
    } = this

    return (
      <FlexWrapper {...props} alignItems='center'>
        <TextWrapper>{isLoading ? t('loading') : currentSite.name}</TextWrapper>
        <IconWrapper style={{ height: '30px', width: '30px' }}>
          <IconTime
            onClick={(event: React.MouseEvent<HTMLInputElement>) => {
              event.stopPropagation()
              openTimeline()
            }}
          />
        </IconWrapper>
      </FlexWrapper>
    )
  }
}

export default SideMenuHeaderMobile
