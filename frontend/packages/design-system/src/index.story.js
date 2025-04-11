import React from 'react'
import { storiesOf } from '@storybook/react'

import Grid from './Grid'
import Text from './Text'
import Input from './Input'
import Switch from './Switch'

storiesOf('All', module).add('All', () => (
  <Grid columns={1}>
    Typography
    <Text size={6}>To infinity and beyond</Text>
    <Text size={5}>To infinity and beyond</Text>
    <Text size={4}>To infinity and beyond</Text>
    <Text size={3}>To infinity and beyond</Text>
    <Text size={2}>To infinity and beyond</Text>
    <Text size={1}>To infinity and beyond</Text>
    <Text>Default text is using Source Sans Pro Regular at 14px.</Text>
    Switch
    <Switch />
    <Switch checked />
    Input
    <Input value='Default' />
    <Input hover value='Hover' />
    <Input focus value='Focus' />
    <Input invalid value='Invalid' />
  </Grid>
))
