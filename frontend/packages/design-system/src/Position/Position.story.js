import React from 'react'
import { storiesOf } from '@storybook/react'

import { Position } from './Position'

storiesOf('Position', module)
  .addParameters({ component: Position })
  .add('default', () => <Position>Position</Position>)
