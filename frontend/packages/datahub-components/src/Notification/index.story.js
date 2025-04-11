import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'

import { IconClose } from '@ehv/datahub-icons'
import {
  ErrorNotification,
  InfoNotification,
  SuccessNotification
} from './Notification'

const successText = `ファイル登録が完了しました\nオルソ画像.tif\n2020年8月26日 登録者：山田太郎`
const successTextLong = `ファイル登録が完了しました\n20200820_千葉県千葉市美浜地区_オルソ画像_ver3.4.5.tif\n2020年8月26日 登録者：山田太郎`
storiesOf('Notifications/SuccessNotification', module)
  .addParameters({ component: SuccessNotification })
  .add('Default', () => (
    <SuccessNotification
      onClose={action('onClose')}
      message={successText}
      dismissLabel={<IconClose />}
    />
  ))
  .add('Long file name', () => (
    <SuccessNotification
      onClose={action('onClose')}
      message={successTextLong}
      dismissLabel={<IconClose />}
    />
  ))

const errorText = `ファイル登録に失敗しました\nオルソ画像.tif\n2020年8月26日 登録者：山田太郎`
const errorTextLong = `ファイル登録に失敗しました\n20200820_千葉県千葉市美浜地区_オルソ画像_ver3.4.5.tif\n2020年8月26日 登録者：山田太郎`
storiesOf('Notifications/ErrorNotification', module)
  .addParameters({ component: ErrorNotification })
  .add('Default', () => (
    <ErrorNotification
      onClose={action('onClose')}
      message={errorText}
      dismissLabel={<IconClose />}
    />
  ))
  .add('Long file name', () => (
    <ErrorNotification
      onClose={action('onClose')}
      message={errorTextLong}
      dismissLabel={<IconClose />}
    />
  ))

storiesOf('Notifications/InfoNotification', module)
  .addParameters({ component: InfoNotification })
  .add('Default', () => (
    <InfoNotification
      onClose={action('onClose')}
      message='This is an info message'
      dismissLabel={<IconClose />}
    />
  ))
