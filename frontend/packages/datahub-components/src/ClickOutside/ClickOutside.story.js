import React from 'react'
import { storiesOf } from '@storybook/react'

import { ClickOutside } from './ClickOutside'
import { action } from '@storybook/addon-actions'

storiesOf('ClickOutside', module)
  .addParameters({ component: ClickOutside })
  .add('default', () => (
    <div>
      <ClickOutside onClickOutside={action('onClickOutside')}>
        <div>ClickOutside</div>
      </ClickOutside>
    </div>
  ))
