import React from 'react'
import { storiesOf } from '@storybook/react'

import SiteNotificationsLoading from './SiteNotificationsLoading'

storiesOf('Site/SiteNotificationsLoading', module)
  .addParameters({ component: SiteNotificationsLoading })
  .add('default', () => <SiteNotificationsLoading />)
  .add('isLoading', () => <SiteNotificationsLoading isLoading />)
  .add('isLoading=false', () => <SiteNotificationsLoading isLoading={false} />)
