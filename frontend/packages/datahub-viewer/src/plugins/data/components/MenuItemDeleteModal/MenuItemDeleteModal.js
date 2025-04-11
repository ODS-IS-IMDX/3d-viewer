// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import type { WithNamespaces } from 'react-i18next'
import { DeleteModal } from 'components'
import type { DeleteItem } from '../../types'

export type MenuItemDeleteModalProps = {|
  ...WithNamespaces,
  onClose: () => void,
  treeItemsData: any,
  setTreeItemsData: (treeItemsData: any) => void,
  getDeleteItem: DeleteItem,
  setDeleteItem: (deleteItem: DeleteItem) => void,
  deleteFile: (treeItem: any) => void,
  viewStructure: any,
  resetSelectedData: () => void
|}

export const MenuItemDeleteModal = (props: MenuItemDeleteModalProps) => {
  const {
    t,
    onClose,
    treeItemsData,
    getDeleteItem,
    setDeleteItem,
    deleteFile,
    resetSelectedData
  } = props
  const emptyDeleteItem: DeleteItem = {
    asset: [],
    folder: []
  }

  let modalMessage = t('dataAdmin.fileDeleteModal.modalText') + `\n`

  const handleCancelClick = event => {
    onClose()
    setDeleteItem(emptyDeleteItem)
  }

  /** 削除対象文字列設定 */
  const setModalMessage = (list: any[]) => {
    list.map(value => {
      return (modalMessage +=
        value.data != null ? `${value.data.name}\n` : `${value.name}\n`)
    })
  }

  const handleDeleteClick = () => {
    deleteFile(treeItemsData)
    setDeleteItem(emptyDeleteItem)
    /** 削除 -> 新規フォルダ作成したときに、画面に表示されるようにするため。 */
    resetSelectedData()
    onClose()
  }

  const item = getDeleteItem

  if (item.asset.length > 0) {
    setModalMessage(item.asset)
  }
  if (item.folder.length > 0) {
    setModalMessage(item.folder)
  }

  return (
    <DeleteModal
      message={modalMessage}
      onCancelClick={event => handleCancelClick(event)}
      onDeleteClick={() => handleDeleteClick()}
    />
  )
}

export default React.memo<MenuItemDeleteModalProps>(MenuItemDeleteModal)
