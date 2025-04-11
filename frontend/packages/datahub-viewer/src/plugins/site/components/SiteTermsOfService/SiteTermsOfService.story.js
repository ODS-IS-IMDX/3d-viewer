import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'

import SiteTermsOfServiceComponent from './SiteTermsOfService'

const SiteTermsOfService = withNamespaces('site')(SiteTermsOfServiceComponent)

storiesOf('Site/SiteTermsOfService', module).add('Default', () => (
  <SiteTermsOfService />
))
