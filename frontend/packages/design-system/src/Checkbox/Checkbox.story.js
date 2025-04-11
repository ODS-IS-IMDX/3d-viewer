import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { Checkbox } from './Checkbox'

storiesOf('Checkbox', module)
  .addParameters({ component: Checkbox })
  .add('Default', () => <Checkbox onChange={action('onChange')} />)
  .add('Default with checked', () => (
    <Checkbox checked onChange={action('onChange')} />
  ))
  .add('Round', () => (
    <Checkbox variant='round' onChange={action('onChange')} />
  ))
  .add('Round with checked', () => (
    <Checkbox variant='round' checked onChange={action('onChange')} />
  ))
  .add('With styles', () => (
    <Checkbox margin={3} color='blue' onChange={action('onChange')} />
  ))
