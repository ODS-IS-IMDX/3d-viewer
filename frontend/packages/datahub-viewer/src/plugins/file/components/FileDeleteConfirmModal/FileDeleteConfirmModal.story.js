import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { FileDeleteConfirmModal as Modal } from './FileDeleteConfirmModal'

const FileDeleteConfirmModal = withNamespaces('file')(Modal)

storiesOf('file/FileDeleteConfirmModal', module)
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .addParameters({ component: FileDeleteConfirmModal })
  .add('Delete Asset', () => (
    <FileDeleteConfirmModal
      file={{ id: 'asset01', name: 'アセット０１' }}
      fileType='asset'
      deleteFile={action('deleteFile')}
      close={action('close')}
    />
  ))
