import React from 'react'
import { storiesOf } from '@storybook/react'

import { Box } from './Box'

storiesOf('Box', module)
  .addDecorator(storyFn => (
    <div
      style={{
        width: '600px',
        height: '600px',
        display: 'flex',
        background: 'grey'
      }}
    >
      {storyFn()}
    </div>
  ))
  .addParameters({ component: Box })
  .add('default', () => (
    <Box
      alignSelf='center'
      color='white'
      fontSize={5} // sets font size value of `theme.fontSize[5]`
      height={200} // sets a height value of `200px` since `theme.sizes is not defined`
      width={200}
      margin={5} // sets margin value of `theme.space[5]`
      backgroundColor='blue'
    >
      Box Content
    </Box>
  ))
  .add('With styles (by px)', () => (
    <Box
      alignSelf='start'
      color='white'
      fontSize='20px'
      height='200px'
      width='200px'
      margin='50px'
      backgroundColor='blue'
    >
      Box Content
    </Box>
  ))
