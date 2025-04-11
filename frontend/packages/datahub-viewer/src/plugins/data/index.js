// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent, createContext } from 'react'
import { Plugin } from '@ehv/react-plugins'
import { SiteMenuFill } from 'plugins/site'
import { SIDE_BAR_ICON_NAME } from 'plugins/site/constants'
import i18n from './i18n'
import { saga } from './saga'
import { reducer } from './reducer'
import routes from './routes'
import { MenuMain as MenuData, DataRoute } from './components'
import MenuItemDeleteLoading from './components/MenuItemDeleteLoading'
import { FileDeleteConfirmModal } from 'plugins/file/components'
import { DeleteModal as FolderDeleteModal } from './components/MenuItemFolder/child-component'

export const ModalWindowsContext: Object = createContext()

export default class DataPlugin extends PureComponent<Object, Object> {
  static plugin: Object = {
    name: 'data',
    requires: ['site'],
    i18n,
    saga,
    reducer,
    routes
  }

  constructor (props: Object) {
    super(props)

    this.state = {
      isFileDeleteConfirmModalOpen: false,
      fileDeleteConfirmModalInfo: {},
      isFolderDeleteModalOpen: false,
      folderDeleteModalInfo: {},
      enableClickOutsideCloseMenuEdit: true
    }
  }

  setFileDeleteConfirmModalOpen: boolean => void = (
    isFileDeleteConfirmModalOpen: boolean
  ) => {
    this.setState({ isFileDeleteConfirmModalOpen })
  }
  setFileDeleteConfirmModalInfo: Object => void = (
    fileDeleteConfirmModalInfo: Object
  ) => {
    this.setState({ fileDeleteConfirmModalInfo })
  }
  setFolderDeleteModalOpen: boolean => void = (
    isFolderDeleteModalOpen: boolean
  ) => {
    this.setState({ isFolderDeleteModalOpen })
  }
  setFolderDeleteModalInfo: Object => void = (
    folderDeleteModalInfo: Object
  ) => {
    this.setState({ folderDeleteModalInfo })
  }
  setEnableClickOutsideCloseMenuEdit: boolean => void = (
    enableClickOutsideCloseMenuEdit: boolean
  ) => {
    this.setState({ enableClickOutsideCloseMenuEdit })
  }

  render () {
    const {
      isFileDeleteConfirmModalOpen,
      fileDeleteConfirmModalInfo,
      isFolderDeleteModalOpen,
      folderDeleteModalInfo,
      enableClickOutsideCloseMenuEdit
    } = this.state

    const {
      setFileDeleteConfirmModalOpen,
      setFileDeleteConfirmModalInfo,
      setFolderDeleteModalOpen,
      setFolderDeleteModalInfo,
      setEnableClickOutsideCloseMenuEdit
    } = this
    const contextValue = {
      setFileDeleteConfirmModalOpen,
      setFileDeleteConfirmModalInfo,
      setFolderDeleteModalOpen,
      setFolderDeleteModalInfo,
      setEnableClickOutsideCloseMenuEdit
    }
    return (
      <Plugin>
        <DataRoute />
        <SiteMenuFill type={SIDE_BAR_ICON_NAME.FILE}>
          <ModalWindowsContext.Provider value={contextValue}>
            <MenuData
              enableClickOutsideCloseMenuEdit={enableClickOutsideCloseMenuEdit}
            />
          </ModalWindowsContext.Provider>
        </SiteMenuFill>
        <MenuItemDeleteLoading />
        {/* react-complex-treeの自動的に<button>タグで包むことしない設定ができたら、各モーダルの描画を各MenuItemに戻す */}
        {/* ファイル削除モーダル */}
        {isFileDeleteConfirmModalOpen && (
          <FileDeleteConfirmModal
            file={fileDeleteConfirmModalInfo.file}
            fileType={fileDeleteConfirmModalInfo.fileType}
            close={event => {
              setFileDeleteConfirmModalOpen(false)
              setEnableClickOutsideCloseMenuEdit(true)
            }}
          />
        )}
        {/* フォルダ削除モーダル */}
        {isFolderDeleteModalOpen && (
          <FolderDeleteModal
            selectedItemData={folderDeleteModalInfo.selectedItemData}
            deleteFolder={folderDeleteModalInfo.handleDelete}
            closeModal={() => {
              setFolderDeleteModalOpen(false)
              setEnableClickOutsideCloseMenuEdit(true)
            }}
          />
        )}
      </Plugin>
    )
  }
}

export { i18n }
