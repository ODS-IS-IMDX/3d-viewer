import React from 'react'
import { storiesOf } from '@storybook/react'
import { ThemeProvider } from 'styled-components'

import { List } from './List'

const theme = {
  space: [0, 4, 7, 12, 32, 64, 128, 256, 512],
  List: {}
}

const Provider = story => <ThemeProvider theme={theme}>{story()}</ThemeProvider>

storiesOf('List', module)
  .addDecorator(Provider)
  .addParameters({ component: List })
  .add('Default', () => (
    <List>
      <List.Item>List Item name</List.Item>
      <List.Item>List Item name</List.Item>
      <List.Item>List Item name</List.Item>
      <List.Item>List Item name</List.Item>
      <List.Item>List Item name</List.Item>
    </List>
  ))
  .add('With styles', () => (
    <List
      lineHeight={3}
      border='1px solid'
      borderColor='blue'
      boxShadow='10px 10px 10px rgba(0,0,0,0.4)'
      borderRadius={3}
    >
      <List.Item>List Item name</List.Item>
      <List.Item>List Item name</List.Item>
      <List.Item>List Item name</List.Item>
      <List.Item>List Item name</List.Item>
      <List.Item>List Item name</List.Item>
    </List>
  ))
