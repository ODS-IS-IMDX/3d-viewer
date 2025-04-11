import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { mockStore } from 'plugins/file/components/__storybook__/mockData'
import { FileProgressModalList as Component } from './FileProgressModalList/FileProgressModalList'

const FileProgressModalList = withNamespaces('file')(Component)

storiesOf('file/FileProgressModalList', module)
  .addDecorator(story => <Provider store={mockStore}>{story()}</Provider>)
  .addParameters({ component: FileProgressModalList })
  .add('Default', () => (
    <FileProgressModalList
      tileFileList={mockStore.getState().file.tile.files}
      uploadFileList={mockStore.getState().file.upload.files}
      cancelUpload={action('cancelUpload')}
      deleteFile={action('deleteFile')}
    />
  ))
