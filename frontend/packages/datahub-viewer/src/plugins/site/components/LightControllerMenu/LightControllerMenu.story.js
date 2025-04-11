import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import LightControllerMenuComponent from './LightControllerMenu'

const LightControllerMenu = withNamespaces('site')(LightControllerMenuComponent)
storiesOf('Site/LightControllerMenu', module)
  .addDecorator(storyFn => (
    <div style={{ marginTop: '300px' }}>{storyFn()}</div>
  ))
  .add('Default', state => (
    <LightControllerMenu
      shadowOptions={{
        datetime: null,
        isShadow: false,
        isEntityShadow: true,
        isTerrainShadow: true
      }}
      setShadowOptions={action('setShadowOptions')}
    />
  ))
