// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
// import { Plugin } from '@ehv/react-plugins'

import i18n from './i18n'
import saga from './saga'
import routes from './routes'
import reducer from './reducer'
import * as actions from './actions'
import { SiteMenuFillOrder } from './constants'
import { detectUpdates } from 'utils/window'

import SiteRoute from './components/SiteRoute'
import SiteMenuFill from './components/SiteMenuFill'
import SiteDetailFill from './components/SiteDetailFill'
import SiteDrawerFill from './components/SiteDrawerFill'
import SiteViewerFill from './components/SiteViewerFill'
import SiteCesiumFill from './components/SiteCesiumFill'
import SiteRouterFill from './components/SiteRouterFill'
import SiteLoading from './components/SiteLoading'
import StoreUpdater from './components/StoreUpdater'
import SiteNotificationsLoading from './components/SiteNotificationsLoading'

type Props = {
  core: any,
  router: any
}

export default class SitePlugin extends React.PureComponent<Props> {
  static plugin = {
    name: 'site',
    requires: [],
    i18n,
    saga,
    actions,
    reducer
  }

  render () {
    const {
      core: { Plugin },
      router: { Router }
    } = this.props

    return (
      <Plugin>
        {detectUpdates() ? <></> : <StoreUpdater />}
        <Router>
          <SiteRoute path={routes.site.path} />
        </Router>
        <SiteLoading />
        <SiteNotificationsLoading />
      </Plugin>
    )
  }
}

export {
  i18n,
  saga,
  routes,
  reducer,
  actions,
  SiteMenuFill,
  SiteDetailFill,
  SiteDrawerFill,
  SiteViewerFill,
  SiteCesiumFill,
  SiteRouterFill,
  StoreUpdater,
  SiteMenuFillOrder
}
