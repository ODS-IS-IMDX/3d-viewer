// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useCallback } from 'react'
import ItemContextMenu, { ItemType } from 'components/ItemContextMenu'

import type { TFunction } from 'react-i18next'
import type { AssetID } from 'plugins/asset/reducer'

type ContextMenuProps = {|
  assetId: AssetID,
  isFileDownloading: boolean,
  position: {
    top: number,
    left: number,
    right: number,
    bottom: number
  },
  isEditButtonEnabled: boolean,
  isDeleteButtonEnabled: boolean,
  isDownloadButtonEnabled: boolean,
  selectItem: (itemType: string) => void,
  closeContextMenu: (event: MouseEvent) => void,
  openContextMenuAssetInfo: (event: MouseEvent) => void,
  t: TFunction
|}

const Component = (props: ContextMenuProps) => {
  const {
    openContextMenuAssetInfo,
    position,
    isEditButtonEnabled,
    isDeleteButtonEnabled,
    isDownloadButtonEnabled,
    isFileDownloading,
    selectItem,
    closeContextMenu
  } = props

  const handleClickItem = useCallback(
    (event: any, type: string) => {
      if (type === ItemType.ITEM_TYPE_DETAIL) {
        event.stopPropagation()
        openContextMenuAssetInfo(event)
      } else if (type === ItemType.ITEM_TYPE_DOWNLOAD) {
        if (!isFileDownloading) {
          selectItem(type)
        }
      } else {
        selectItem(type)
        closeContextMenu(event)
      }
    },
    [isFileDownloading, openContextMenuAssetInfo, closeContextMenu, selectItem]
  )

  return (
    <ItemContextMenu
      isDisplayEdit={isEditButtonEnabled}
      isDisplayDetail
      isDisplayDownload={isDownloadButtonEnabled}
      position={position}
      isDisplayDelete={isDeleteButtonEnabled}
      onClickItem={handleClickItem}
      onClick={closeContextMenu}
      onBlur={closeContextMenu}
    />
  )
}

export const ContextMenu = React.memo<ContextMenuProps>(Component)
