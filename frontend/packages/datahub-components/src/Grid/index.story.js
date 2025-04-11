import React from 'react'
import { storiesOf } from '@storybook/react'

import { Grid } from './Grid'
import { GridItem } from './GridItem'

storiesOf('Grid', module)
  .addParameters({
    component: Grid,
    subcomponents: { GridItem }
  })
  .add('default', () => (
    <Grid variant='VARIANT'>
      <div>Grid</div>
    </Grid>
  ))
  .add('GridItem', () => (
    <Grid variant='VARIANT'>
      <GridItem>
        <div>GridItem</div>
      </GridItem>
    </Grid>
  ))
