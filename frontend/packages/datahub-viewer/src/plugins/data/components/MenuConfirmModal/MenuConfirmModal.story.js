import React from 'react'
import { storiesOf } from '@storybook/react'
import MenuConfirmModal from './MenuConfirmModal'
import { withNamespaces } from 'react-i18next'
import { action } from '@storybook/addon-actions'

const MenuConfirmModalComponent = withNamespaces('data')(MenuConfirmModal)

storiesOf('data/MenuConfirmModal', module)
  .addParameters({ component: MenuConfirmModalComponent })
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .add('Default', () => (
    <MenuConfirmModalComponent
      isOpen
      handleModalClose={action('handleModalClose')}
      handleOnClickSave={action('handleOnClickSave')}
      handleOnClickNotSave={action('handleOnClickNotSave')}
    />
  ))
