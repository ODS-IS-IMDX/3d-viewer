import React from 'react'
import { storiesOf } from '@storybook/react'

import SiteLoading from './SiteLoading'

storiesOf('Site/SiteLoading', module)
  .addParameters({ component: SiteLoading })
  .add('default', () => <SiteLoading />)
  .add('isLoading', () => <SiteLoading isLoading />)
  .add('isLoading=false', () => <SiteLoading isLoading={false} />)
