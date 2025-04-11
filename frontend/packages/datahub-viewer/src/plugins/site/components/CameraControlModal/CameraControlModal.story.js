import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import CameraControlModalComponent from './CameraControlModal'

const CameraControlModal = withNamespaces('site')(CameraControlModalComponent)

storiesOf('Site/CameraControlModal', module).add('Default', state => (
  <CameraControlModal
    onSubmit={action('onSubmit')}
    onClose={action('onClose')}
  />
))
