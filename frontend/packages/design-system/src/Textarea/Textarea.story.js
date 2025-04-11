import React from 'react'
import { storiesOf } from '@storybook/react'

import Grid from '../Grid'
import { Textarea } from './Textarea'

storiesOf('Textarea', module)
  .addParameters({ component: Textarea })
  .add('All', () => (
    <Grid gridGap={20} style={{ maxWidth: '1000px' }}>
      <Textarea value='Default' rows='4' cols='40' />
      <Textarea hover value='Hover' rows='4' cols='40' />
      <Textarea focus value='Focus' rows='4' cols='40' />
      <Textarea invalid value='Invalid' rows='4' cols='40' />
      <Textarea variant='primary' value='Primary' rows='4' cols='40' />
      <Textarea variant='secondary' value='Secondary' rows='4' cols='40' />
      <Textarea
        variant='readonly'
        readonly
        value='Readonly'
        rows='4'
        cols='40'
      />
    </Grid>
  ))
  .add('Default', () => <Textarea value='Default' rows='4' cols='40' />)
  .add('Hover', () => <Textarea hover value='Hover' rows='4' cols='40' />)
  .add('Focus', () => <Textarea focus value='Focus' rows='4' cols='40' />)
  .add('Invalid', () => <Textarea invalid value='Invalid' rows='4' cols='40' />)
  .add('Primary', () => (
    <Textarea variant='primary' value='Primary' rows='4' cols='40' />
  ))
  .add('Secondary', () => (
    <Textarea variant='secondary' value='Secondary' rows='4' cols='40' />
  ))
  .add('Readonly', () => (
    <Textarea variant='readonly' readonly value='Readonly' rows='4' cols='40' />
  ))
