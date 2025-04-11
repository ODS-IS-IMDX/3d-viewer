import React from 'react'
import { storiesOf } from '@storybook/react'

import { Banner } from './Banner'

storiesOf('Banner', module)
  .addParameters({ component: Banner })
  .add('default', () => (
    <Banner p='5' alignItems='left'>
      Banner align left
    </Banner>
  ))
