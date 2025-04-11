import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import MarkedDateTimePicker from './MarkedDateTimePicker'

const existDevicesDate = [
  {
    year: 2022,
    month: 1,
    day: 1
  }
]

const dt = new Date()
const toDate = new Date(dt.getTime())

storiesOf('MarkedDateTimePicker', module)
  .addParameters({ component: MarkedDateTimePicker })
  .add('Default', () => (
    <MarkedDateTimePicker
      value={toDate}
      existDevicesDate={existDevicesDate}
      onChange={action('onChange')}
      startCollectHistoricalCalendarData={action(
        'startCollectHistoricalCalendarData'
      )}
      deviceId={1}
    />
  ))
