import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { mockMenuItemData } from 'plugins/data/components/__storybook__/mockMenuItemData'
import { MenuItemDeleteModal } from './MenuItemDeleteModal'
import { withNamespaces } from 'react-i18next'
import { action } from '@storybook/addon-actions'

const DeleteModal = withNamespaces('data')(MenuItemDeleteModal)

const getDeleteItem = mockMenuItemData.getDeleteItem()

storiesOf('data/MenuItemDeleteModal', module)
  .addParameters({ component: DeleteModal })
  .addDecorator(story => (
    <Provider store={mockMenuItemData}>{story()}</Provider>
  ))
  .addDecorator(story => <div style={{ width: '500px' }}>{story()}</div>)
  .add('MenuItemDeleteModal', () => (
    <DeleteModal
      getDeleteItem={getDeleteItem}
      onClose={action('setIsOpenMenuItemModal')}
      setTreeItemsData={action('setTreeItemsData')}
    />
  ))
