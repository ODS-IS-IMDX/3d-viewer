import React from 'react'
import { storiesOf } from '@storybook/react'

import { OverflowEllipsis } from './OverflowEllipsis'

storiesOf('OverflowEllipsis', module)
  .addParameters({ component: OverflowEllipsis })
  .add('Default', () => (
    <div style={{ width: '100px' }}>
      <OverflowEllipsis>あいうえおかきくけこさしすせそ</OverflowEllipsis>
    </div>
  ))
