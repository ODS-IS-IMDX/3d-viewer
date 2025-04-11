import React from 'react'
import { storiesOf } from '@storybook/react'

import { SiteDetailFill } from './SiteDetailFill'

storiesOf('Site/SiteDetailFill', module)
  .addParameters({ component: SiteDetailFill })
  .add('default', () => <SiteDetailFill />)
