// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import {
  getAssetList,
  isLoading as isAssetLoading,
  isError as isAssetError
} from 'plugins/asset/selectors'
import { changeMenuMode } from 'plugins/data/actions'
import { setViewStructure } from 'plugins/site/actions'
import {
  getIsMobile,
  getOpenViewName,
  getViewStructure
} from 'plugins/site/selectors'

import { MenuShow as Component } from './MenuShow'

const mapStateToProps = state => ({
  assetList: getAssetList(state),
  isAssetLoading: isAssetLoading(state),
  isAssetError: isAssetError(state),
  viewStructure: getViewStructure(state),
  isMobile: getIsMobile(state),
  openViewName: getOpenViewName(state)
})

const mapDispatchToProps = {
  changeMenuMode,
  setViewStructure
}

export const MenuShow: any = compose(
  withNamespaces('data'),
  connect(mapStateToProps, mapDispatchToProps)
)(Component)
