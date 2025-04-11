import React from 'react'
import { storiesOf } from '@storybook/react'

import { SiteDrawerFill } from './SiteDrawerFill'

storiesOf('Site/SiteDrawerFill', module)
  .addParameters({ component: SiteDrawerFill })
  .add('default', () => <SiteDrawerFill />)
