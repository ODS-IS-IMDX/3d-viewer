import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import BackButton from './BackButton'

storiesOf('BackButton', module)
  .addParameters({ component: BackButton })
  .add('default', () => <BackButton label='Back' onClick={action('onClick')} />)
