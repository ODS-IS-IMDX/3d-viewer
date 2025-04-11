import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import DateTimePicker from './DateTimePicker'

storiesOf('DateTimePicker', module)
  .addParameters({ component: DateTimePicker })
  .add('default', () => <DateTimePicker onChange={action('onChange')} />)
  .add('custom time format', () => (
    <DateTimePicker timeFormat='HH:00' onChange={action('onChange')} />
  ))
  .add('custom date format', () => (
    <DateTimePicker
      dateFormat='MM--YYYY'
      timeFormat={false}
      onChange={action('onChange')}
    />
  ))
