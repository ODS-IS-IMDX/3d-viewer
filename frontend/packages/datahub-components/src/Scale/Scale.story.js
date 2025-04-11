import React from 'react'
import { storiesOf } from '@storybook/react'

import Scale from './Scale'

storiesOf('Scale', module)
  .addParameters({ component: Scale })
  .add('width=50', () => <Scale width={50} value='width=50' />)
  .add('width=200', () => <Scale width={200} value='width=200' />)
  .add('width=500', () => <Scale width={500} value='width=500' />)
