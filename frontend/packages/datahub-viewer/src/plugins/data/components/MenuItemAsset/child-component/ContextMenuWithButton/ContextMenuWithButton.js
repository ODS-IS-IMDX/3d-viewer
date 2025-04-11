// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { useContext } from 'react'
import styled from 'styled-components'
import { IconDots } from '@ehv/datahub-icons'
import { useContextMenuWithElement, CornerType } from '@ehv/datahub-components'
import { ModalWindowsContext } from 'plugins/data'
import { InfoContextMenu } from '../InfoContextMenu'
import { ContextMenu } from './ContextMenu'
import { ItemType } from 'components/ItemContextMenu'
import { FILE_TYPE, EHV_ASSET_TYPE } from 'plugins/file/constants'

import type { TFunction } from 'react-i18next'
import type { FileAddIntoDownloadingListAction } from 'plugins/file/actions'

const IconWrapper = styled.div`
  display: block;
  width: 30px;
  height: 18px;
  text-align: center;
  line-height: 0;
`

const iconStyle = {
  width: '15px',
  height: '15px',
  verticalAlign: 'middle',
  textAlign: 'center'
}

type ContextMenuWithButtonProps = {|
  asset: Asset,
  subFileType: string,
  downloadingFileIdList: Array<String>,
  isTimelineDrawerOpen: boolean,
  addIntoDownloadingList: (id: string) => FileAddIntoDownloadingListAction,
  downloadFile: (fileType: string, id: string) => void,
  initAssetEditingData: (asset: AssetEditingData) => void,
  openAssetEditDrawer: () => void,
  closeTimelineDrawer: () => void,
  t: TFunction
|}

const Component = (props: ContextMenuWithButtonProps) => {
  const {
    asset,
    subFileType,
    addIntoDownloadingList,
    downloadingFileIdList,
    isTimelineDrawerOpen,
    downloadFile,
    initAssetEditingData,
    closeTimelineDrawer,
    t
  } = props
  const {
    id,
    displayName,
    name,
    createdAt,
    updatedAt,
    createdBy,
    startDateTime,
    endDateTime,
    customPosition,
    ehvAssetType
  } = asset

  const {
    setEnableClickOutsideCloseMenuEdit,
    setFileDeleteConfirmModalOpen,
    setFileDeleteConfirmModalInfo
  } = useContext(ModalWindowsContext)

  // アセットメニュー用useContextMenu
  const {
    isMenuOpen: isMenuOpenAssetMenu,
    menuPosition: menuPositionAssetMenu,
    openContextMenu: openContextMenuAssetMenu,
    closeContextMenu: closeContextMenuAssetMenu,
    elementRef: elementRefAssetMenu
  } = useContextMenuWithElement({
    elementCorner: CornerType.topRight,
    menuCorner: CornerType.topLeft,
    absolute: { x: 16, y: -6 },
    menuWidth: 128,
    menuHeight: 128
  })

  // アセット情報用useContextMenu
  const {
    isMenuOpen: isMenuOpenAssetInfo,
    menuPosition: menuPositionAssetInfo,
    openContextMenu: openContextMenuAssetInfo,
    closeContextMenu: closeContextMenuAssetInfo,
    elementRef: elementRefAssetInfo
  } = useContextMenuWithElement({
    elementCorner: CornerType.topRight,
    menuCorner: CornerType.topLeft,
    absolute: { x: 16, y: -6 },
    menuWidth: 300,
    menuHeight: 156
  })

  // NOTE: 3DVからアップロードしたLASおよびLASから変換した空間IDのみ編集可能
  const isEditable =
    ehvAssetType === EHV_ASSET_TYPE.EHV_TILE ||
    ehvAssetType === EHV_ASSET_TYPE.EHV_SPACE_INFO
  const isFileDownloading = downloadingFileIdList.includes(id)

  const handleContextMenuItemSelect = (itemType: string) => {
    if (itemType === ItemType.ITEM_TYPE_EDIT) {
      setEnableClickOutsideCloseMenuEdit(false)
      if (isTimelineDrawerOpen) {
        closeTimelineDrawer()
      }

      initAssetEditingData({
        assetId: id,
        subFileType,
        name,
        displayName,
        startDateTime,
        endDateTime,
        customPosition
      })
    } else if (itemType === ItemType.ITEM_TYPE_DOWNLOAD) {
      addIntoDownloadingList(id)
      downloadFile(FILE_TYPE.ASSET, id)
    } else if (itemType === ItemType.ITEM_TYPE_DELETE) {
      setEnableClickOutsideCloseMenuEdit(false)
      setFileDeleteConfirmModalInfo({
        file: asset,
        fileType: FILE_TYPE.ASSET
      })
      setFileDeleteConfirmModalOpen(true)
    }
  }

  return (
    <>
      {/* コンテキストメニューボタン */}
      <IconWrapper
        ref={element => {
          elementRefAssetMenu(element)
          elementRefAssetInfo(element)
        }}
      >
        <IconDots
          style={iconStyle}
          onClick={event => {
            event.preventDefault()
            event.stopPropagation()
            openContextMenuAssetMenu(event)
          }}
        />
      </IconWrapper>
      {/* コンテキストメニュー */}
      {isMenuOpenAssetMenu && (
        <ContextMenu
          assetId={id}
          isFileDownloading={isFileDownloading}
          isEditButtonEnabled={isEditable}
          isDeleteButtonEnabled={isEditable}
          isDownloadButtonEnabled={isEditable}
          position={menuPositionAssetMenu}
          selectItem={handleContextMenuItemSelect}
          closeContextMenu={closeContextMenuAssetMenu}
          openContextMenuAssetInfo={openContextMenuAssetInfo}
          t={t}
        />
      )}
      {/* アセット情報メニュー */}
      {isMenuOpenAssetInfo && (
        <InfoContextMenu
          fileName={name}
          displayName={displayName}
          createdAt={createdAt}
          updatedAt={updatedAt}
          user={createdBy}
          position={menuPositionAssetInfo}
          closeContextMenu={event => closeContextMenuAssetInfo(event)}
        />
      )}
    </>
  )
}

export const ContextMenuWithButton = React.memo<ContextMenuWithButtonProps>(
  Component
)
