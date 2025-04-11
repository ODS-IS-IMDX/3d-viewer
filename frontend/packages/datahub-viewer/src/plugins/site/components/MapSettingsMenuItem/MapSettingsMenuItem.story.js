import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import MapSettingsMenuItemComponent from './MapSettingsMenuItem'

const MapSettingsMenuItem = withNamespaces('site')(MapSettingsMenuItemComponent)

storiesOf('Site/MapSettingsMenuItem', module).add('Default', state => (
  <MapSettingsMenuItem />
))
