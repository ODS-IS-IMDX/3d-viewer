import React from 'react'
import { storiesOf } from '@storybook/react'

import { Radio } from './Radio'

storiesOf('Radio', module)
  .addParameters({ component: Radio })
  .add('default', () => (
    <p>
      <Radio name='story' />
      yes
      <br />
      <Radio name='story' checked />
      no
    </p>
  ))
