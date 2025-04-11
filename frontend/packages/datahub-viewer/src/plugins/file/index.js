// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'

import { Plugin } from '@ehv/react-plugins'

import { i18n } from './i18n'
import { saga } from './saga'
import { reducer } from './reducer'

export default class FilePlugin extends PureComponent<{}> {
  static plugin = {
    name: 'file',
    requires: ['site'],
    i18n,
    saga,
    reducer
  }

  render () {
    return <Plugin>{null}</Plugin>
  }
}

export { i18n }
