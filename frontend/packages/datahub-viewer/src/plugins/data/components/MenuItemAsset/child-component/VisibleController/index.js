// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { VisibleController as Component } from './VisibleController'
import {
  getVisTimeline,
  getIsDrawerOpen,
  getInTimelineDataList
} from 'plugins/data/selectors'
import { getIsMobile } from 'plugins/site/selectors'
import {
  setDesignfileVisibility,
  setTopographyVisibility
} from 'plugins/asset/actions'
import { setTimelineShowData } from 'plugins/data/actions'

import type { AssetID } from 'plugins/asset/reducer'
import type { TimelineData } from 'plugins/data/reducer'

const mapStateToProps = state => ({
  isDrawerOpen: getIsDrawerOpen(state),
  inTimelineDataList: getInTimelineDataList(state),
  visTimeline: getVisTimeline(state),
  isMobile: getIsMobile(state)
})

const mapDispatchToProps = dispatch => ({
  setTimelineShowData: (
    timelineDataList: Array<TimelineData>,
    isShow: boolean
  ) => dispatch(setTimelineShowData(timelineDataList, isShow)),
  /*
   * subFileType: 1 // 1:統合地形
   * subFileType: 2 // 2:画像
   * subFileType: 3 // 3:3Dモデル
   * subFileType: 4 // 4:設計ファイル
   * subFileType: 5 // 5:オーバレイ
   */
  setVisibilityFunctionList: [
    null,
    (id: AssetID, isVisible: boolean) =>
      dispatch(setTopographyVisibility(id, isVisible)),
    null,
    null,
    (id: AssetID, isVisible: boolean) =>
      dispatch(setDesignfileVisibility(id, isVisible)),
    null
  ]
})

export const VisibleController = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
