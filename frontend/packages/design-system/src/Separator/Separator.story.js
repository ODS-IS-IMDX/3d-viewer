import React from 'react'
import { storiesOf } from '@storybook/react'

import Box from '../Box'
import Separator from '.'

storiesOf('Separator', module)
  .addParameters({ component: Separator })
  .add('Separator', () => (
    <Box>
      <Separator />
    </Box>
  ))
