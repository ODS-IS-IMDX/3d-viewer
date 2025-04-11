import React from 'react'
import { storiesOf } from '@storybook/react'

import { Cell } from './Cell'

storiesOf('Cell', module)
  .addParameters({ component: Cell })
  .add('default', () => <Cell>Cell default</Cell>)
  .add('Cell center=true', () => <Cell center='true'>Cell ceter=true</Cell>)
