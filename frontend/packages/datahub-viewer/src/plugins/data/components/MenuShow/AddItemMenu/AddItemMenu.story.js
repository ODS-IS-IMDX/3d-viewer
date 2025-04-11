import React from 'react'
import { Provider } from 'react-redux'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { mockMenuItemData } from 'plugins/data/components/__storybook__/mockMenuItemData'
import { AddItemMenu } from '.'

storiesOf('data/AddItemMenu', module)
  .addParameters({ component: AddItemMenu })
  .addDecorator(story => (
    <Provider store={mockMenuItemData}>{story()}</Provider>
  ))
  .addDecorator(story => <div style={{ width: '500px' }}>{story()}</div>)
  .add('Default', () => <AddItemMenu onClickItem={action('onClickItem')} />)
