import React from 'react'
import { storiesOf } from '@storybook/react'

import { SiteViewerFill } from './SiteViewerFill'

storiesOf('Site/SiteViewerFill', module)
  .addParameters({ component: SiteViewerFill })
  .add('default', () => <SiteViewerFill />)
