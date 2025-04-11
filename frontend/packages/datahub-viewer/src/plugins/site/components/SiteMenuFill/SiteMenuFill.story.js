import React from 'react'
import { storiesOf } from '@storybook/react'

import { SiteMenuFill } from './SiteMenuFill'

storiesOf('Site/SiteMenuFill', module)
  .addParameters({ component: SiteMenuFill })
  .add('default', () => <SiteMenuFill order={2}>SiteMenuFIll</SiteMenuFill>)
