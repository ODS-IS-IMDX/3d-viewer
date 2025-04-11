import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { mockSiteStore } from 'plugins/site/components/__storybook__/mockData'
import { SiteUserContextMenu as SiteUserContextMenuComponent } from './SiteUserContextMenu'

const SiteUserContextMenu = withNamespaces('site')(SiteUserContextMenuComponent)

storiesOf('Site/SiteUserContextMenu', module)
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .add('Default', () => (
    <SiteUserContextMenu
      position={{ top: 10, left: 10 }}
      firstName={'TestFirstName'}
      lastName={'TestLastName'}
      email={'test@example.com'}
      language={'ja'}
      logout={action('onClick')}
    />
  ))
  .add('Mobile Default', () => (
    <SiteUserContextMenu
      position={{ top: 10, left: 10 }}
      firstName={'TestFirstName'}
      lastName={'TestLastName'}
      email={'test@example.com'}
      language={'ja'}
      logout={action('onClick')}
      isMobile
    />
  ))
