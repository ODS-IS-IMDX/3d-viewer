// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { getSite, getSiteId, getIsMobile, isLoading } from '../../selectors'
import { isDrawerOpen as isAssetDrawerOpen } from 'plugins/asset/selectors'
import SideMenuHeader from './SideMenuHeader'
import { setClusterList } from '../../actions'
import { cancelEditAsset } from 'plugins/asset/actions'
import { openDrawer as openTimelineDrawer } from 'plugins/data/actions'

const mapStateToProps = state => ({
  siteId: getSiteId(state),
  currentSite: getSite(state) || {},
  isLoading: isLoading(state),
  isAssetDrawerOpen: isAssetDrawerOpen(state),
  isMobile: getIsMobile(state)
})
const mapDispatchToProps = dispatch => ({
  openTimeline: () => dispatch(openTimelineDrawer()),
  setClusterList: any => dispatch(setClusterList(any)),
  cancelEditAsset: () => dispatch(cancelEditAsset())
})

export default compose(
  withNamespaces('site'),
  connect(mapStateToProps, mapDispatchToProps)
)(SideMenuHeader)
