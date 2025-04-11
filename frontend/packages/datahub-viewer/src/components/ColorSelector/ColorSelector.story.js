import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { ColorSelector } from './ColorSelector'

storiesOf('ColorSelector', module).add('default', () => (
  <ColorSelector onChange={action('onChange')} />
))
