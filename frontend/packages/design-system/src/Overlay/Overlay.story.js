import React from 'react'
import { storiesOf } from '@storybook/react'

import { Overlay } from './Overlay'
import Backdrop from '../Backdrop'

storiesOf('Overlay', module)
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .addParameters({ component: Overlay })
  .add('default', () => (
    <Backdrop>
      <Overlay>Overlaying Content</Overlay>
    </Backdrop>
  ))
