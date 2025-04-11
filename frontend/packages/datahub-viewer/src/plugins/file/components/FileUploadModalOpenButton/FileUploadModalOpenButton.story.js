import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { mockStore } from 'plugins/file/components/__storybook__/mockData'
import { FileUploadModalOpenButton as Component } from './FileUploadModalOpenButton'

const FileUploadModalOpenButton = withNamespaces('file')(Component)
storiesOf('file/FileUploadModalOpenButton', module)
  .addDecorator(story => <Provider store={mockStore}>{story()}</Provider>)
  .addParameters({ component: FileUploadModalOpenButton })
  .add('Default', () => (
    <FileUploadModalOpenButton isEnabled onClose={action('onClose')} />
  ))
  .add('Button disabled', () => (
    <FileUploadModalOpenButton isEnabled={false} onClose={action('onClose')} />
  ))
