import React from 'react'
import { storiesOf } from '@storybook/react'

import SiteDrawerSlots from './SiteDrawerSlot'

storiesOf('Site/SiteDrawerSlots', module)
  .addParameters({ component: SiteDrawerSlots })
  .add('default', () => <SiteDrawerSlots />)
