import React from 'react'
import { storiesOf } from '@storybook/react'

import { SiteRouterFill } from './SiteRouterFill'

storiesOf('Site/SiteRouterFill', module)
  .addParameters({ component: SiteRouterFill })
  .add('default', () => <SiteRouterFill />)
