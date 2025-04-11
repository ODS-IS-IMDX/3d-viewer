// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { memo, useCallback, useContext } from 'react'
import _ from 'lodash'
import styled from 'styled-components'
import { IconDots } from '@ehv/datahub-icons'
import {
  Text,
  ContextMenuWithHook,
  useContextMenuWithElement,
  CornerType
} from '@ehv/datahub-components'
import { ModalWindowsContext } from 'plugins/data'
import { recursionDeleteTreeItem, setTreeIndex } from 'plugins/data/utils'
import { MENU_MODE } from 'plugins/data/constants'

import type { TreeItem } from 'react-complex-tree'
import type { TFunction } from 'react-i18next'

// $FlowFixMe
export const ContextMenuWithHookStyled = styled(ContextMenuWithHook)`
  z-index: 999999;
  & > div {
    border-radius: 0 10px 10px 0;
  }
`
const IconWrapper = styled.div`
  display: block;
  width: 30px;
  text-align: center;
`

const iconStyle = {
  width: '15px',
  height: '15px',
  verticalAlign: 'middle'
}

type ContextMenuWithButtonProps = {|
  item: TreeItem<any>,
  treeItemsData: any,
  setTreeItemsData: (treeItemsData: any) => void,
  selectedItemData: any,
  setSelectedItemData: (selectItemData: any) => void,
  openUpdateFolderModal: () => void,
  menuMode: string,
  t: TFunction
|}
const Component = (props: ContextMenuWithButtonProps) => {
  const {
    item,
    treeItemsData,
    setTreeItemsData,
    selectedItemData,
    setSelectedItemData,
    openUpdateFolderModal,
    menuMode,
    t
  } = props
  const { index, data } = item
  const { name, isDirectory, children } = data

  const {
    isMenuOpen,
    menuPosition,
    openContextMenu,
    closeContextMenu,
    elementRef
  } = useContextMenuWithElement({
    elementCorner: CornerType.topRight,
    menuCorner: CornerType.topLeft,
    absolute: { x: 16, y: -6 }
  })

  const {
    setFolderDeleteModalOpen,
    setFolderDeleteModalInfo,
    setEnableClickOutsideCloseMenuEdit
  } = useContext(ModalWindowsContext)

  const handleDelete = useCallback(
    id => {
      let newTreeItems = _.cloneDeep(treeItemsData)
      const targetItem = treeItemsData[id]
      recursionDeleteTreeItem(newTreeItems, targetItem.index)
      newTreeItems = setTreeIndex(newTreeItems)
      setTreeItemsData(newTreeItems)
    },
    [treeItemsData, setTreeItemsData]
  )

  const handleDeleteFolderClick = () => {
    setEnableClickOutsideCloseMenuEdit(false)
    setFolderDeleteModalInfo({
      selectedItemData,
      handleDelete
    })
    setFolderDeleteModalOpen(true)
  }

  const handleIconClick = useCallback(
    (event: MouseEvent) => {
      event.stopPropagation()
      openContextMenu(event)
      setSelectedItemData({
        id: index,
        name,
        data,
        file: {},
        isDirectory,
        isOrigin: false,
        enableDelete: children.length === 0
      })
    },
    [
      setSelectedItemData,
      children,
      data,
      index,
      isDirectory,
      name,
      openContextMenu
    ]
  )

  if (menuMode === MENU_MODE.SHOW) {
    return null
  }

  return (
    <>
      {/* コンテキストメニューボタン */}
      <IconWrapper ref={element => elementRef(element)}>
        <IconDots style={iconStyle} onClick={handleIconClick} />
      </IconWrapper>
      {/* コンテキストメニュー */}
      {isMenuOpen && (
        <ContextMenuWithHookStyled
          position={menuPosition}
          width={150}
          isClosableByClick
          onClick={closeContextMenu}
          onBlur={closeContextMenu}
        >
          {/* フォルダ名変更 */}
          <ContextMenuWithHook.Item onClick={openUpdateFolderModal}>
            <Text size={0}>{t('dataAdmin.modal.renameFolder')}</Text>
          </ContextMenuWithHook.Item>
          {/* フォルダ削除 */}
          {children.length === 0 && (
            <ContextMenuWithHook.Item onClick={handleDeleteFolderClick}>
              <Text size={0}>{t('dataAdmin.modal.delete')}</Text>
            </ContextMenuWithHook.Item>
          )}
        </ContextMenuWithHookStyled>
      )}
    </>
  )
}

export const ContextMenuWithButton = memo<ContextMenuWithButtonProps>(Component)
