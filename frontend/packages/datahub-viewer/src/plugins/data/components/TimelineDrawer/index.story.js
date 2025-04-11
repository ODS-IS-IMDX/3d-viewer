import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { mockMenuItemData } from 'plugins/data/components/__storybook__/mockMenuItemData'
import { TimelineDrawer } from '.'

storiesOf('data/AssetTimelineDrawer', module)
  .addParameters({ component: TimelineDrawer })
  .addDecorator(story => (
    <Provider store={mockMenuItemData}>{story()}</Provider>
  ))
  .add('Default', () => <TimelineDrawer />)
