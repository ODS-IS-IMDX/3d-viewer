import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import RenderQualityModalComponent from './RenderQualityModal'

const RenderQualityModal = withNamespaces('site')(RenderQualityModalComponent)

storiesOf('Site/RenderQualityModal', module).add('Default', () => (
  <RenderQualityModal
    value='low'
    onClose={action('onClose')}
    onSubmit={action('onSubmit')}
  />
))
