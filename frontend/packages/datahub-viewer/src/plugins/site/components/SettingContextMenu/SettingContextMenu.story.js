import React from 'react'
import { storiesOf } from '@storybook/react'
import { Provider } from 'react-redux'
import SettingContextMenu from './SettingContextMenu'
import { mockSiteStore } from '../__storybook__/mockData'
import { withNamespaces } from 'react-i18next'
import { action } from '@storybook/addon-actions'

const Component = withNamespaces('site')(SettingContextMenu)

storiesOf('Site/SettingContextMenu', module)
  .addParameters({ component: Component })
  .addDecorator(story => <Provider store={mockSiteStore}>{story()}</Provider>)
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .add('Default', () => (
    <Component
      handleOpenCameraControlModal={action('handleOpenCameraControlModal')}
      handleOpenNotificationsModal={action('handleOpenNotificationsModal')}
    />
  ))
