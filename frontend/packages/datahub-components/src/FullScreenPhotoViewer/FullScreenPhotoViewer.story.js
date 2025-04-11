import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { FullScreenPhotoViewer } from './FullScreenPhotoViewer'

storiesOf('FullScreenPhotoViewer', module)
  .addParameters({ component: FullScreenPhotoViewer })
  .add('default', () => (
    <FullScreenPhotoViewer
      title='TITLE'
      onNext={action('onNext')}
      onPrevious={action('onPrevious')}
      onClose={action('onClose')}
    />
  ))
