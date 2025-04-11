// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Plugin } from '@ehv/react-plugins'
import { Fill } from '@ehv/react-slots'

import i18n from './i18n'
import saga from './saga'
import NotificationContainer from 'components/NotificationContainer'

export default class NotificationPlugin extends React.PureComponent<Props> {
  static plugin = {
    name: 'notifications',
    i18n,
    saga
  }

  render () {
    return (
      <Plugin>
        <Fill slot='root'>
          <NotificationContainer />
        </Fill>
      </Plugin>
    )
  }
}
