import React from 'react'
import { storiesOf } from '@storybook/react'

import ContextMenu from './ContextMenu'
import ContextMenuItem from './ContextMenuItem'
import Divider from './ContextMenuDivider'
import ContextMenuTrigger from './ContextMenuTrigger'
import { Button } from '../index'

storiesOf('ContextMenu', module)
  .addParameters({
    component: ContextMenu,
    subcomponents: { ContextMenuItem, Divider, ContextMenuTrigger }
  })
  .addDecorator(story => (
    <div style={{ width: '500px', height: '500px', backgroundColor: 'grey' }}>
      {story()}
    </div>
  ))
  .add('Default', () => (
    <ContextMenuTrigger
      location='right'
      menu={props => (
        <ContextMenu {...props} width={300}>
          <ContextMenu.Item label='ファイル名'>
            点群ファイル.laz
          </ContextMenu.Item>
          <ContextMenu.Item label='登録者'>山田太郎</ContextMenu.Item>
          <Divider />
          <ContextMenu.Item label='登録日'>2020年8月5日</ContextMenu.Item>
        </ContextMenu>
      )}
    >
      <Button>Open</Button>
    </ContextMenuTrigger>
  ))
  .add('isClosableByClick false', () => (
    <ContextMenuTrigger
      location='right'
      menu={props => (
        <ContextMenu {...props} width={300} isClosableByClick={false}>
          <ContextMenu.Item label='ファイル名'>
            点群ファイル.laz
          </ContextMenu.Item>
          <ContextMenu.Item label='登録者'>山田太郎</ContextMenu.Item>
          <Divider />
          <ContextMenu.Item label='登録日'>2020年8月5日</ContextMenu.Item>
        </ContextMenu>
      )}
    >
      <Button>Open</Button>
    </ContextMenuTrigger>
  ))
  .add('OpenByMouseOver', () => (
    <ContextMenuTrigger
      location='right'
      openByMouseOver
      menu={props => (
        <ContextMenu {...props} width={300}>
          <ContextMenu.Item label='ファイル名'>
            点群ファイル.laz
          </ContextMenu.Item>
          <ContextMenu.Item label='登録者'>山田太郎</ContextMenu.Item>
          <Divider />
          <ContextMenu.Item label='登録日'>2020年8月5日</ContextMenu.Item>
        </ContextMenu>
      )}
    >
      <Button>Open</Button>
    </ContextMenuTrigger>
  ))
