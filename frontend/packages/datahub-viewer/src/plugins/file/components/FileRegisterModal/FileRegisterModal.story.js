import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { mockStore } from 'plugins/file/components/__storybook__/mockData'
import { FileRegisterModal as Component } from './FileRegisterModal'

const FileRegisterModal = withNamespaces('file')(Component)

storiesOf('file/FileRegisterModal', module)
  .addParameters({ component: FileRegisterModal })
  .add('las', () => (
    <FileRegisterModal
      fileList={mockStore.getState().file.upload.files}
      index={0}
      isMultiInput={false}
      setFilesInfo={action('setFilesInfo')}
      setModalType={action('setModalType')}
    />
  ))
  .add('citygml', () => (
    <FileRegisterModal
      fileList={mockStore.getState().file.upload.files}
      index={23}
      isMultiInput={false}
      setFilesInfo={action('setFilesInfo')}
      setModalType={action('setModalType')}
    />
  ))
  .add('multi input', () => (
    <FileRegisterModal
      fileList={mockStore.getState().file.upload.files}
      index={0}
      isMultiInput
      setFilesInfo={action('setFilesInfo')}
      setModalType={action('setModalType')}
    />
  ))
