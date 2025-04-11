import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'

import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'
import SiteActionButtons from './SiteActionButtons'

storiesOf('site/SiteActionButtons', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .addParameters({ component: SiteActionButtons })
  .add('Default', () => <SiteActionButtons hasAccessToken />)
