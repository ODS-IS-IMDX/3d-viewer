import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'

import SitePermissionToUseComponent from './SitePermissionToUse'

const SitePermissionToUse = withNamespaces('site')(SitePermissionToUseComponent)

storiesOf('Site/SitePermissionToUse', module).add('Default', () => (
  <SitePermissionToUse />
))
