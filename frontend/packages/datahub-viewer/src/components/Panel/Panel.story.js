import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Panel } from './Panel'

storiesOf('Panel', module)
  .addParameters({ component: Panel })
  .add('default', () => (
    <Panel onClose={action('onClose')}>
      <div>Panel body</div>
    </Panel>
  ))
