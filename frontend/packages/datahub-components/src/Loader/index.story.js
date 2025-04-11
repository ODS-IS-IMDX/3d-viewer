import React from 'react'
import { storiesOf } from '@storybook/react'

import { Loader } from './Loader'

const sampleMenu = () => <div>メニュー</div>

storiesOf('Loader', module)
  .addParameters({ component: Loader })
  .add('Loading true', () => (
    <Loader loading loadingLabel='読込中'>
      {sampleMenu}
    </Loader>
  ))
  .add('Loading false', () => (
    <Loader loading={false} loadingLabel='読込中'>
      {sampleMenu}
    </Loader>
  ))
