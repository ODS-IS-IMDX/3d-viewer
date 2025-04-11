import React from 'react'
import { storiesOf } from '@storybook/react'

import { Initials } from './Initials'

storiesOf('Initials', module)
  .addParameters({ component: Initials })
  .add('default', () => <Initials fullName='FULL NAME' />)
