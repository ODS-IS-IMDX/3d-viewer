import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'

import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'
import { SiteMenu as SiteMenuComponent } from './SiteMenu'

const SiteMenu = withNamespaces('site')(SiteMenuComponent)

storiesOf('Site/SiteMenu', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .add('Default', () => <SiteMenu onlyLogoRow={false} />)
  .add('Only logo', () => <SiteMenu onlyLogoRow />)
