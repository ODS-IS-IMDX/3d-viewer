import React from 'react'
import { storiesOf } from '@storybook/react'

import { AnalyticInfoRow } from './AnalyticInfoRow'

storiesOf('AnalyticInfoRow', module)
  .addParameters({ component: AnalyticInfoRow })
  .add('default', () => <AnalyticInfoRow />)
