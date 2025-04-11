import React from 'react'
import { storiesOf } from '@storybook/react'

import { Grid } from './Grid'

storiesOf('Grid', module)
  .addParameters({ component: Grid })
  .add('3 columns', () => (
    <Grid columns={3} style={{ width: '800px' }}>
      <div>Grid 1</div>
      <div>Grid 2</div>
      <div>Grid 3</div>
    </Grid>
  ))
