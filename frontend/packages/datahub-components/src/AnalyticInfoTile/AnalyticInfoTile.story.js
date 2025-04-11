import React from 'react'
import { storiesOf } from '@storybook/react'

import { AnalyticInfoTile } from './AnalyticInfoTile'

storiesOf('AnalyticInfoTile', module)
  .addParameters({ component: AnalyticInfoTile })
  .add('default', () => (
    <AnalyticInfoTile
      title='TITLE'
      value='VALUE'
      description='DESCRIPTION'
      additional='ADDITIONAL'
    />
  ))
  .add('empty is true', () => (
    <AnalyticInfoTile
      title='TITLE'
      value='VALUE'
      description='DESCRIPTION'
      additional='ADDITIONAL'
      empty
    />
  ))
  .add('empty is false', () => (
    <AnalyticInfoTile
      title='TITLE'
      value='VALUE'
      description='DESCRIPTION'
      additional='ADDITIONAL'
      empty={false}
    />
  ))
