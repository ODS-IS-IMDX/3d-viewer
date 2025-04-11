import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import MapviewModalComponent from './MapviewModal'

const MapviewModal = withNamespaces('site')(MapviewModalComponent)

storiesOf('Site/MapviewModal', module).add('Default', () => (
  <MapviewModal
    value='low'
    onClose={action('onClose')}
    onSubmit={action('onSubmit')}
  />
))
