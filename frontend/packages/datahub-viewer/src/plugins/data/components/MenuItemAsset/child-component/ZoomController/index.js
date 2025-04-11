// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { ZoomController as Component } from './ZoomController'
import { isLoading, isRendering } from 'plugins/asset/selectors'
import { getIsMobile } from 'plugins/site/selectors'
import { flyToDesignfile, flyToTopography } from 'plugins/asset/actions'

import type { AssetID } from 'plugins/asset/reducer'

const mapStateToProps = state => ({
  isLoading: isLoading(state),
  assetRenderingStatus: isRendering(state),
  isMobile: getIsMobile(state)
})

const mapDispatchToProps = dispatch => ({
  /*
   * subFileType: 1 // 1:統合地形
   * subFileType: 2 // 2:画像
   * subFileType: 3 // 3:3Dモデル
   * subFileType: 4 // 4:設計ファイル
   * subFileType: 5 // 5:オーバレイ
   */
  flyToFunctionList: [
    null,
    (id: AssetID) => dispatch(flyToTopography(id)),
    null,
    null,
    (id: AssetID) => dispatch(flyToDesignfile(id)),
    null
  ]
})
export const ZoomController = connect(
  mapStateToProps,
  mapDispatchToProps
)(Component)
