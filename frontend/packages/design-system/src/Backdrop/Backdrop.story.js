import React from 'react'
import { storiesOf } from '@storybook/react'

import { Backdrop } from './Backdrop'

storiesOf('Backdrop', module)
  .addParameters({ component: Backdrop })
  .add('default', () => <Backdrop />)
