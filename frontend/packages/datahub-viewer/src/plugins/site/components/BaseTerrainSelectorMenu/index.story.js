import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import BaseTerrainSelectorMenuComponent from './BaseTerrainSelectorMenu'

const BaseTerrainSelectorMenu = withNamespaces('site')(
  BaseTerrainSelectorMenuComponent
)

storiesOf('Site/BaseTerrainSelectorMenu', module).add('Default', () => (
  <BaseTerrainSelectorMenu value='satellite' onChange={action('onChange')} />
))
