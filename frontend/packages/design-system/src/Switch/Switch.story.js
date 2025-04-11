import React from 'react'
import { storiesOf } from '@storybook/react'

import Grid from '../Grid'
import { Switch } from './Switch'

storiesOf('Switch', module)
  .addParameters({ component: Switch })
  .add('All', () => (
    <Grid columns={1}>
      <Switch />
      <Switch readOnly checked />
    </Grid>
  ))
