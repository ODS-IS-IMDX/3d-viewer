// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import styled from 'styled-components'
import type { WithNamespaces } from 'react-i18next'

import { ContextMenuWithHook, Text } from '@ehv/datahub-components'

import { generateLocalizedDate } from 'utils/localization'
import type { User } from 'plugins/asset/reducer'

type InfoContextMenuProps = {|
  displayName: string,
  fileName: string,
  /** ISO 8601形式 例：2020-09-14T05:47:44.746Z */
  createdAt: string,
  /** ISO 8601形式 例：2020-09-14T05:47:44.746Z */
  updatedAt: string,
  user: User,
  language: string,
  closeContextMenu: () => void,
  ...WithNamespaces
|}
export const ContextMenuWithHookStyled = styled(ContextMenuWithHook)`
  z-index: 999999;
`
const StyledText = styled(Text)`
  word-break: break-all;
`

const Component = (props: InfoContextMenuProps) => {
  const {
    displayName,
    fileName,
    createdAt,
    updatedAt,
    user,
    closeContextMenu,
    t
  } = props
  const dateFormat = t('menuItem.asset.infoContextMenu.dateFormat')
  const localizedCreatedAt = generateLocalizedDate(createdAt, dateFormat)
  const localizedUpdatedAt = generateLocalizedDate(updatedAt, dateFormat)

  return (
    <ContextMenuWithHookStyled
      {...props}
      width={300}
      onClick={closeContextMenu}
      onBlur={closeContextMenu}
    >
      <ContextMenuWithHook.Item>
        <StyledText>
          {t('menuItem.asset.infoContextMenu.displayName')}
          {displayName}
        </StyledText>
      </ContextMenuWithHook.Item>
      <ContextMenuWithHook.Item>
        <StyledText>
          {t('menuItem.asset.infoContextMenu.fileName')}
          {fileName}
        </StyledText>
      </ContextMenuWithHook.Item>
      <ContextMenuWithHook.Item>
        <Text>
          {t('menuItem.asset.infoContextMenu.createdAtLabel')}
          {localizedCreatedAt}
        </Text>
      </ContextMenuWithHook.Item>
      <ContextMenuWithHook.Item>
        <Text>
          {t('menuItem.asset.infoContextMenu.updatedAtLabel')}
          {localizedUpdatedAt}
        </Text>
      </ContextMenuWithHook.Item>
      <ContextMenuWithHook.Item>
        <Text>
          {t('menuItem.asset.infoContextMenu.userNameLabel')}
          {user.email}
        </Text>
      </ContextMenuWithHook.Item>
    </ContextMenuWithHookStyled>
  )
}

export const InfoContextMenu = React.memo<InfoContextMenuProps>(Component)
