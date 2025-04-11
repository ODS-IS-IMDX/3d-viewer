import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'

import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'
import { SiteRoute as SiteRouteComponent } from './SiteRoute'

const SiteRoute = withNamespaces('site')(SiteRouteComponent)

storiesOf('Site/SiteRoute', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .add('Default', () => <SiteRoute />)
