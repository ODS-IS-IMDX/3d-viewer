import React from 'react'
import { storiesOf } from '@storybook/react'

import { AnalyticFeatureListName } from './AnalyticFeatureListName'

storiesOf('AnalyticFeatureListName', module)
  .addParameters({ component: AnalyticFeatureListName })
  .add('default', () => <AnalyticFeatureListName />)
