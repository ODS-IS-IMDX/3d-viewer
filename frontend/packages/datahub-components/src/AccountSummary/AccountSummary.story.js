import React from 'react'
import { storiesOf } from '@storybook/react'

import { AccountSummary } from './AccountSummary'

storiesOf('AccountSummary', module)
  .addParameters({ component: AccountSummary })
  .add('default', () => (
    <AccountSummary
      className='CLASSNAME'
      email='E-MAIL'
      name='NAME'
      linkLabel='LINK LABEL'
    />
  ))
