import React from 'react'
import { storiesOf } from '@storybook/react'

import { AnimatedLoading } from './AnimatedLoading'

storiesOf('AnimatedLoading', module)
  .addParameters({ component: AnimatedLoading })
  .addDecorator(storyFn => (
    <div style={{ width: '300px', padding: '300px' }}>{storyFn()}</div>
  ))
  .add('Default', () => <AnimatedLoading />)
