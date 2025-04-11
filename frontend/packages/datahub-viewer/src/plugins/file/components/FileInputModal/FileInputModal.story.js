import React from 'react'
import { Provider } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { mockStore } from 'plugins/file/components/__storybook__/mockData'
import { FileInputModal as Component } from './FileInputModal'

const FileInputModal = withNamespaces('file')(Component)

storiesOf('file/FileInputModal', module)
  .addDecorator(story => <Provider store={mockStore}>{story()}</Provider>)
  .addParameters({ component: FileInputModal })
  .add('Default', () => (
    <FileInputModal
      close={action('close')}
      putFilesIntoState={action('putFilesIntoState')}
      setModalType={action('setModalType')}
    />
  ))
