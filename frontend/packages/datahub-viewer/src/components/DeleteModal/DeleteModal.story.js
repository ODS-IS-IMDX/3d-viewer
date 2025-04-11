import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import DeleteModalComponent from './DeleteModal'
const DeleteModal = withNamespaces()(DeleteModalComponent)

const actions = {
  onCancelClick: action('onCancelClick'),
  onDeleteClick: action('onDeleteClick')
}

const message = '点群ファイル.laz\nこのアセットを削除します'

storiesOf('components/DeleteModal', module)
  .addDecorator(storyFn => (
    <div style={{ width: '600px', height: '600px' }}>{storyFn()}</div>
  ))
  .addParameters({ component: DeleteModal })
  .add('Default', () => (
    <DeleteModal
      message={message}
      cancelButtonLabel='キャンセル'
      deleteButtonLabel='削除'
      {...actions}
    />
  ))
