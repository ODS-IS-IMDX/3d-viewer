// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'

import { Plugin } from '@ehv/react-plugins'

import i18n from './i18n'
import saga from './saga'
import { SiteCesiumFill } from 'plugins/site'
import reducer from './reducer'
import {
  AssetEditDrawer,
  DesignfileLayers,
  TopographyLayers
} from './components'

export default class AssetPlugin extends PureComponent<{}> {
  static plugin = {
    name: 'asset',
    requires: ['site'],
    // routes,
    i18n,
    saga,
    reducer
  }

  render () {
    return (
      <Plugin>
        <SiteCesiumFill>
          <TopographyLayers />
          <DesignfileLayers />
        </SiteCesiumFill>
        <AssetEditDrawer />
      </Plugin>
    )
  }
}

export { i18n }
