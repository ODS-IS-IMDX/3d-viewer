import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'

import { mockStore } from 'plugins/file/components/__storybook__/mockData'
import { FileNumberPanel as Component } from './FileNumberPanel'

const FileNumberPanel = withNamespaces('file')(Component)

storiesOf('file/FileNumberPanel', module)
  .addDecorator(story => <Provider store={mockStore}>{story()}</Provider>)
  .addParameters({ component: FileNumberPanel })
  .add('Default', () => (
    <FileNumberPanel tileNumber={10} needUploadNumber={20} errorNumber={5} />
  ))
  .add('Only has upload', () => (
    <FileNumberPanel tileNumber={0} needUploadNumber={20} errorNumber={0} />
  ))
  .add('Only has tile', () => (
    <FileNumberPanel tileNumber={10} needUploadNumber={0} errorNumber={0} />
  ))
  .add('Only has error', () => (
    <FileNumberPanel tileNumber={0} needUploadNumber={0} errorNumber={5} />
  ))
  .add('No file', () => (
    <FileNumberPanel tileNumber={0} needUploadNumber={0} errorNumber={0} />
  ))
