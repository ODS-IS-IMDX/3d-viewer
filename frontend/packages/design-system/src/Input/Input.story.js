import React from 'react'
import { storiesOf } from '@storybook/react'

import Grid from '../Grid'
import { Input } from './Input'

storiesOf('Input', module)
  .addParameters({ component: Input })
  .add('All', () => (
    <Grid gridGap={20} style={{ maxWidth: '1000px' }}>
      <Input value='Default' />
      <Input hover value='Hover' />
      <Input focus value='Focus' />
      <Input invalid value='Invalid' />
      <Input variant='primary' value='Primary' />
      <Input variant='secondary' value='Secondary' />
      <Input variant='readonly' readonly value='Readonly' />
    </Grid>
  ))
  .add('Default', () => <Input value='Default' />)
  .add('Hover', () => <Input hover value='Hover' />)
  .add('Focus', () => <Input focus value='Focus' />)
  .add('Invalid', () => <Input invalid value='Invalid' />)
  .add('Primary', () => <Input variant='primary' value='Primary' />)
  .add('Secondary', () => <Input variant='secondary' value='Secondary' />)
  .add('Readonly', () => <Input variant='readonly' readonly value='Readonly' />)
