import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { ImagerySettings } from './ImagerySettings'

storiesOf('ImagerySettings', module)
  .addParameters({ component: ImagerySettings })
  .add('default', () => (
    <ImagerySettings onClose={action('onClose')}>
      <div>ImagerySettings</div>
    </ImagerySettings>
  ))
