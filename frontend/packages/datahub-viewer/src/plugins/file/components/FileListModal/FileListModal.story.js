import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { mockStore } from 'plugins/file/components/__storybook__/mockData'
import { MAX_UPLOAD_FILE_NAME_LENGTH } from 'plugins/file/constants'
import { FileListModal as Component } from './FileListModal'

const FileListModal = withNamespaces('file')(Component)

storiesOf('file/FileListModal', module)
  .addDecorator(story => <Provider store={mockStore}>{story()}</Provider>)
  .addParameters({ component: FileListModal })
  .add('Default', () => (
    <FileListModal
      fileList={mockStore.getState().file.upload.files}
      close={action('close')}
      deleteFileFromList={action('deleteFileFromList')}
      selectFile={action('selectFile')}
      setModalType={action('setModalType')}
      uploadFiles={action('uploadFiles')}
    />
  ))
  .add('has caution text', () => (
    <FileListModal
      fileList={mockStore
        .getState()
        .file.upload.files.filter((file, index) => index === 1)}
      close={action('close')}
      deleteFileFromList={action('deleteFileFromList')}
      selectFile={action('selectFile')}
      setModalType={action('setModalType')}
      uploadFiles={action('uploadFiles')}
    />
  ))
  .add('No caution text', () => (
    <FileListModal
      fileList={mockStore
        .getState()
        .file.upload.files.filter((file, index) => index === 5)}
      close={action('close')}
      deleteFileFromList={action('deleteFileFromList')}
      selectFile={action('selectFile')}
      setModalType={action('setModalType')}
      uploadFiles={action('uploadFiles')}
    />
  ))
  .add('Upload enabled', () => (
    <FileListModal
      fileList={mockStore
        .getState()
        .file.upload.files.filter(file => !!file.info)
        .filter(file => [...file.name].length <= MAX_UPLOAD_FILE_NAME_LENGTH)}
      close={action('close')}
      deleteFileFromList={action('deleteFileFromList')}
      selectFile={action('selectFile')}
      setModalType={action('setModalType')}
      uploadFiles={action('uploadFiles')}
    />
  ))
  .add('has invalid file', () => (
    <FileListModal
      fileList={mockStore
        .getState()
        .file.upload.files.filter((file, index) => index === 13)}
      close={action('close')}
      deleteFileFromList={action('deleteFileFromList')}
      selectFile={action('selectFile')}
      setModalType={action('setModalType')}
      uploadFiles={action('uploadFiles')}
    />
  ))
