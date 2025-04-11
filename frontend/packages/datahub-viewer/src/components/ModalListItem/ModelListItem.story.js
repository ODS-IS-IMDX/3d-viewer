import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import ModalListItem from './ModalListItem'

storiesOf('ModalListItem', module)
  .addParameters({ component: ModalListItem })
  .add('default selected=true', () => (
    <ModalListItem selected onClick={action('onClick')}>
      <div>ModalListItem</div>
    </ModalListItem>
  ))
  .add('default selected=false', () => (
    <ModalListItem selected={false} onClick={action('onClick')}>
      <div>ModalListItem</div>
    </ModalListItem>
  ))
