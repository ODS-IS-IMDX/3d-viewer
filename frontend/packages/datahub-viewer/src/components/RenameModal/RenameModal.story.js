import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import RenameModal from './RenameModal'

storiesOf('RenameModal', module)
  .addParameters({ component: RenameModal })
  .add('default', () => (
    <RenameModal
      name='NAME'
      title='TITLE'
      onClose={action('onClose')}
      onSubmit={action('onSubmit')}
      t={param => action(`t=${param}`)}
    />
  ))
