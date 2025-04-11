import React from 'react'
import { storiesOf } from '@storybook/react'

import MenuItemDeleteLoading from './MenuItemDeleteLoading'

storiesOf('data/MenuItemDeleteLoading', module)
  .addParameters({ component: MenuItemDeleteLoading })
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .add('Loading', () => <MenuItemDeleteLoading isLoading />)
  .add('Not Loading', () => <MenuItemDeleteLoading isLoading={false} />)
