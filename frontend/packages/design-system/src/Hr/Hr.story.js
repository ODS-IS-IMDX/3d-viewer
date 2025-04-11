import React from 'react'
import { storiesOf } from '@storybook/react'

import { Hr } from './Hr'

storiesOf('Hr', module)
  .addParameters({ component: Hr })
  .add('Default', () => <Hr />)
  .add('With styles', () => <Hr margin={5} />)
