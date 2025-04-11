// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { getViewer } from 'plugins/site/selectors'
import { TimelineDrawer as TimelineDrawerComponent } from './TimelineDrawer'
import {
  setDesignfileVisibility,
  setTopographyVisibility
} from 'plugins/asset/actions'
import {
  closeDrawer,
  removeVisTimeline,
  setVisTimeline,
  setTimelineShowData
} from 'plugins/data/actions'

import type { AssetID } from 'plugins/asset/reducer'
import type { VisTimeline, TimelineData } from 'plugins/data/reducer'

const mapStateToProps = state => ({
  viewer: getViewer(state)
})

const mapDispatchToProps = dispatch => ({
  closeDrawer: () => dispatch(closeDrawer()),
  removeVisTimeline: (visTimelineInstance: any) =>
    dispatch(removeVisTimeline(visTimelineInstance)),
  setVisTimeline: (visTimeline: VisTimeline) =>
    dispatch(setVisTimeline(visTimeline)),
  /*
   * subFileType: 1 // 1:統合地形
   * subFileType: 2 // 2:画像
   * subFileType: 3 // 3:3Dモデル
   * subFileType: 4 // 4:設計ファイル
   * subFileType: 5 // 5:オーバレイ
   */
  setAssetVisibilityFunctionList: [
    null,
    (id: AssetID, isVisible: boolean) =>
      dispatch(setTopographyVisibility(id, isVisible)),
    null,
    null,
    (id: AssetID, isVisible: boolean) =>
      dispatch(setDesignfileVisibility(id, isVisible)),
    null
  ],
  setTimelineShowData: (
    timelineDataList: Array<TimelineData>,
    isShow: boolean
  ) => dispatch(setTimelineShowData(timelineDataList, isShow))
})

export const TimelineDrawer: any = compose(
  withNamespaces('data'),
  connect(mapStateToProps, mapDispatchToProps)
)(TimelineDrawerComponent)
