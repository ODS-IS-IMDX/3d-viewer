import React from 'react'
import { withNamespaces } from 'react-i18next'
import { storiesOf } from '@storybook/react'

import { InfoContextMenu as Component } from './InfoContextMenu'

const InfoContextMenu = withNamespaces('data')(Component)

storiesOf('data/MenuItemAsset/InfoContextMenu', module)
  .addParameters({ component: InfoContextMenu })
  .addDecorator(story => <div style={{ margin: '20px' }}>{story()}</div>)
  .add('Japanese user', () => (
    <InfoContextMenu
      displayName='点群ファイル.表示名'
      fileName='点群ファイル.laz'
      createdAt='2020-08-25T01:43:52.957Z'
      updatedAt='2020-08-28T13:35:05.392Z'
      user={{ firstName: 'firstName', lastName: 'lastName' }}
      language='ja'
    />
  ))
  .add('Not Japanese user', () => (
    <InfoContextMenu
      displayName='点群ファイル.表示名'
      fileName='点群ファイル.laz'
      createdAt='2020-08-25T01:43:52.957Z'
      updatedAt='2020-08-28T13:35:05.392Z'
      user={{ firstName: 'firstName', lastName: 'lastName' }}
      language='en'
    />
  ))
  .add('Long file name', () => (
    <InfoContextMenu
      displayName='2020-08-25_千葉県千葉市美浜_画像_version1.0.3.表示名'
      fileName='2020-08-25_千葉県千葉市美浜_画像_version1.0.3.tif'
      createdAt='2020-08-25T01:43:52.957Z'
      updatedAt='2020-08-28T13:35:05.392Z'
      user={{ firstName: '太郎', lastName: '山田' }}
      language='ja'
    />
  ))
