// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import type { WithNamespaces } from 'react-i18next'
import { ContextMenuWithHook, Text } from '@ehv/datahub-components'

const ContextMenuWrapper = styled(ContextMenuWithHook)`
  z-index: 1;
  ${props =>
    props.isMobile
      ? `
      max-width: 360px;
      width: 95%;
    `
      : `
      width: 280px;
  `}
  & > div {
    padding: 12px 0;
    border-radius: 5px;
  }
`
const ContextMenuItemUserInfo = styled(ContextMenuWithHook.Item)`
  height: 31px;
  padding: 0 8px 0 20px;
  align-items: center;
  &:hover {
    cursor: default;
    background-color: #ffffff;
  }
`
const ContextMenuDivider = styled(ContextMenuWithHook.Divider)`
  margin: 8px 12px;
  border-bottom: ${props =>
    props.isMobile ? '1px solid #DDDDDD' : '1px solid #187abc'};
`
const TextWrapper = styled(Text)`
  overflow-x: hidden;
  line-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
`

type SiteUserContextMenuProps = WithNamespaces & {
  position: {
    top: number,
    right: number,
    bottom: number,
    left: number
  },
  email: string,
  site: {
    id: string,
    name: string
  },
  language: string,
  isMobile: boolean
}

export class SiteUserContextMenu extends PureComponent<SiteUserContextMenuProps> {
  render () {
    const {
      t,
      position,
      email,
      site,
      language,
      isMobile,
      ...props
    } = this.props
    return (
      <ContextMenuWrapper isMobile={isMobile} {...props} position={position}>
        <ContextMenuItemUserInfo>
          <TextWrapper fontSize={isMobile ? 16 : 12}>{email}</TextWrapper>
        </ContextMenuItemUserInfo>
        <ContextMenuDivider isMobile={isMobile} />
        <ContextMenuItemUserInfo>
          <TextWrapper fontSize={isMobile ? 16 : 12}>{site.name}</TextWrapper>
        </ContextMenuItemUserInfo>
      </ContextMenuWrapper>
    )
  }
}

export default SiteUserContextMenu
