// Copyright (c) 2025 NTT InfraNet
// @flow
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import SiteViewer from './SiteViewer'
import {
  getSite,
  getViewer,
  getMapControlKeySettings,
  getIsMobile,
  getIsMapSetting
} from '../../selectors'
import {
  getIsDrawerOpen as isTimelineDrawerOpen,
  getVisTimeline
} from 'plugins/data/selectors'
import { isDrawerOpen as isAssetDrawerOpen } from 'plugins/asset/selectors'
import { getMaterialContourOptions } from '../../selectors/materials'
import {
  setViewer,
  unsetViewer,
  setClusterList,
  changeSceneMode,
  flyToCurrentLocation,
  setContourOptions
} from '../../actions'
import { cancelEditAsset } from 'plugins/asset/actions'
import {
  closeDrawer as closeTimelineDrawer,
  removeVisTimeline
} from 'plugins/data/actions'
import { notifyInit } from '../../../notifications/actions'
import { getAccessToken } from 'addons/auth'

const mapStateToProps = state => ({
  site: getSite(state),
  viewer: getViewer(state),
  isTimelineDrawerOpen: isTimelineDrawerOpen(state),
  getVisTimeline: getVisTimeline(state),
  contourOptions: getMaterialContourOptions(state),
  mapControlKeySettings: getMapControlKeySettings(state),
  isMapSetting: getIsMapSetting(state),
  isAssetDrawerOpen: isAssetDrawerOpen(state),
  isMobile: getIsMobile(state),
  accessToken: getAccessToken(state)
})

const mapDispatchToProps = {
  setViewer,
  unsetViewer,
  setClusterList,
  closeTimelineDrawer,
  removeVisTimeline,
  notifyInit,
  changeSceneMode,
  flyToCurrentLocation,
  setContourOptions,
  cancelEditAsset
}

export default compose(
  withNamespaces('site'),
  connect(mapStateToProps, mapDispatchToProps)
)(SiteViewer)
