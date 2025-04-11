// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { SiteRoute } from './SiteRoute'
import { getIsMobile, getSiteId, getSiteOpen } from 'plugins/site/selectors'

export type SiteRouteProps = {}

const mapStateToProps = state => ({
  siteId: getSiteId(state),
  isSiteOpen: getSiteOpen(state),
  isMobile: getIsMobile(state)
})

export default compose(
  withNamespaces('site'),
  connect(mapStateToProps)
)(SiteRoute)
