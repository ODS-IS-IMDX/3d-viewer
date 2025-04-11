import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import ItemContextMenuComponent from './ItemContextMenu'
const ItemContextMenu = withNamespaces()(ItemContextMenuComponent)

storiesOf('components/ItemContextMenu', module)
  .addParameters({ component: ItemContextMenu })
  .add('default', () => (
    <ItemContextMenu
      id='contextMenu'
      position={{
        top: 0,
        left: 0
      }}
      isDisplayEdit
      isDisplayDetail
      isDisplayClampToSurface
      isDisplayBackFaceDisplay
      isDisplayDownload
      isDisplayDelete
      isClampToSurface
      isBackFaceDisplay
      onClickItem={action('onClickItem')}
    />
  ))
