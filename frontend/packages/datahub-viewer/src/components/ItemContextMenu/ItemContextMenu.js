// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { ContextMenuWithHook, Text } from '@ehv/datahub-components'
import {
  IconTrash,
  IconActionDownloadFile,
  IconEditSolid,
  IconInfo
} from '@ehv/datahub-icons'

import type { TFunction } from 'react-i18next'

export type ItemContextMenuProps = {
  position: {
    top: number,
    left: number,
    right: number,
    bottom: number
  },
  isDisplayEdit: boolean,
  isDisplayDetail: boolean,
  isDisplayDownload: boolean,
  isDisplayDelete: boolean,
  isDisplayClampToSurface: boolean,
  isDisplayBackFaceDisplay: boolean,
  isDisplayOverlayProperty: boolean,
  isClampToSurface: boolean,
  isBackFaceDisplay: boolean,
  onClickItem: (event: any, type: string) => void,
  t: TFunction
}

export const ItemType = {
  ITEM_TYPE_EDIT: 'ITEM_EDIT',
  ITEM_TYPE_DETAIL: 'ITEM_TYPE_DETAIL',
  ITEM_TYPE_DOWNLOAD: 'ITEM_TYPE_DOWNLOAD',
  ITEM_TYPE_DELETE: 'ITEM_TYPE_DELETE',
  ITEM_TYPE_CLAMP_TO_SURFACE: 'ITEM_TYPE_CLAMP_TO_SURFACE',
  ITEM_TYPE_BACK_FACE_DISPLAY: 'ITEM_TYPE_BACK_FACE_DISPLAY',
  ITEM_TYPE_OVERLAY_PROPERTY: 'ITEM_TYPE_OVERLAY_PROPERTY'
}

const StyledContextMenu = styled(ContextMenuWithHook)`
  width: 128px;
  z-index: 99999;
  & > div {
    border-radius: 0 10px 10px 0;
  }
`
const StyledContextMenuItem = styled(ContextMenuWithHook.Item)`
  padding: 8px 12px;
`
const IconWrapper = styled.div`
  width: 12px;
  height: 12px
  margin: 2px 6px 2px 0;
`
const StyledText = styled(Text)`
  word-break: break-all;
`

export const ItemContextMenu = ({
  t,
  position,
  isDisplayEdit,
  isDisplayDetail,
  isDisplayDownload,
  isDisplayDelete,
  isDisplayClampToSurface,
  isDisplayBackFaceDisplay,
  isDisplayOverlayProperty,
  isClampToSurface,
  isBackFaceDisplay,
  onClickItem,
  ...props
}: ItemContextMenuProps) => {
  const handleClickItem = useCallback(
    type => event => {
      onClickItem(event, type)
    },
    [onClickItem]
  )

  return (
    <StyledContextMenu {...props} position={position}>
      {isDisplayEdit && (
        <StyledContextMenuItem
          onClick={handleClickItem(ItemType.ITEM_TYPE_EDIT)}
        >
          <IconWrapper>
            <IconEditSolid />
          </IconWrapper>
          <StyledText>{t('itemMenu.edit')}</StyledText>
        </StyledContextMenuItem>
      )}
      {isDisplayDetail && (
        <StyledContextMenuItem
          onClick={handleClickItem(ItemType.ITEM_TYPE_DETAIL)}
        >
          <IconWrapper>
            <IconInfo />
          </IconWrapper>
          <StyledText>{t('itemMenu.detail')}</StyledText>
        </StyledContextMenuItem>
      )}
      {isDisplayDownload && (
        <StyledContextMenuItem
          onClick={handleClickItem(ItemType.ITEM_TYPE_DOWNLOAD)}
        >
          <IconWrapper>
            <IconActionDownloadFile />
          </IconWrapper>
          <StyledText>{t('itemMenu.download')}</StyledText>
        </StyledContextMenuItem>
      )}
      {isDisplayDelete && (
        <StyledContextMenuItem
          onClick={handleClickItem(ItemType.ITEM_TYPE_DELETE)}
        >
          <IconWrapper>
            <IconTrash />
          </IconWrapper>
          <StyledText>{t('itemMenu.delete')}</StyledText>
        </StyledContextMenuItem>
      )}
    </StyledContextMenu>
  )
}

export default ItemContextMenu
