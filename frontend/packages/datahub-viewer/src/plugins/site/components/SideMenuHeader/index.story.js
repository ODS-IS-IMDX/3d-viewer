import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'

import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'
import { SideMenuHeader as SideMenuHeaderComponent } from './SideMenuHeader'

const SideMenuHeader = withNamespaces('site')(SideMenuHeaderComponent)

storiesOf('Site/SideMenuHeader', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .add('Default', () => (
    <SideMenuHeader siteId='site-01' currentSite={{ name: '現場1' }} />
  ))
  .add('Loading', () => (
    <SideMenuHeader
      siteId='site-01'
      currentSite={{ name: '現場1' }}
      isLoading
    />
  ))
