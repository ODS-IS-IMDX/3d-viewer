import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { mockMenuItemData } from 'plugins/data/components/__storybook__/mockMenuItemData'
import { ModalWindowsContext } from 'plugins/data'
import { MenuMain } from './MenuMain'
import { MENU_MODE } from 'plugins/data/constants'

storiesOf('data/MenuMain', module)
  .addParameters({ component: MenuMain })
  .addDecorator(Story => (
    <Provider store={mockMenuItemData}>
      <Story />
    </Provider>
  ))
  .addDecorator(Story => (
    <ModalWindowsContext.Provider
      value={{
        setDeleteAnnotationModalOpen: () => null,
        setDeleteAnnotationModalInfo: () => null,
        setAssetEditModalOpen: () => null,
        setAssetEditModalInfo: () => null,
        setFileDeleteConfirmModalOpen: () => null,
        setFileDeleteConfirmModalInfo: () => null,
        setFolderDeleteModalOpen: () => null,
        setFolderDeleteModalInfo: () => null,
        setEnableClickOutsideCloseMenuEdit: () => null,
        setDeleteWmtsModalOpen: () => null,
        setDeleteWmtsModalInfo: () => null,
        setDeviceEditModalOpen: () => null,
        setDeviceEditModalInfo: () => null
      }}
    >
      <Story />
    </ModalWindowsContext.Provider>
  ))
  .addDecorator(Story => (
    <div style={{ width: '500px' }}>
      <Story />
    </div>
  ))
  .add('MenuMain: mode show', () => <MenuMain menuMode={MENU_MODE.SHOW} />)
  .add('MenuMain: mode edit', () => <MenuMain menuMode={MENU_MODE.EDIT} />)
