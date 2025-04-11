import React from 'react'
import { storiesOf } from '@storybook/react'

import { Flex } from './Flex'
import Box from '../Box'

storiesOf('Flex', module)
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .addParameters({ component: Flex })
  .add('Direction row', () => (
    <Flex
      flexWrap='nowrap'
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
    >
      <Box>Text1</Box>
      <Box>Text2</Box>
      <Box>Text3</Box>
    </Flex>
  ))
  .add('Direction column', () => (
    <Flex
      flexWrap='nowrap'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
    >
      <Box>Text1</Box>
      <Box>Text2</Box>
      <Box>Text3</Box>
    </Flex>
  ))
