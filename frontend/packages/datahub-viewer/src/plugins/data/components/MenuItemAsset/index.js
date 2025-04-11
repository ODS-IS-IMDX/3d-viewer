// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { MenuItemAsset as Component } from './MenuItemAsset'
import { getAssetList } from 'plugins/asset/selectors'
import {
  setTopographyPointSize,
  setTopographyTransparency,
  setAssetStyle,
  resetAssetStyle
} from 'plugins/asset/actions'
import { setOpenSideContextMenu } from 'plugins/site/actions'
import { getIsMobile, getViewer } from 'plugins/site/selectors'
import { getOpenSideContextMenu } from 'plugins/site/selectors/sideBar'
import { getMenuMode } from 'plugins/data/selectors'

const mapStateToProps = state => ({
  assetList: getAssetList(state),
  menuMode: getMenuMode(state),
  openSideContextMenu: getOpenSideContextMenu(state),
  isMobile: getIsMobile(state),
  viewer: getViewer(state)
})

const mapDispatchToProps = {
  setTopographyPointSize,
  setTopographyTransparency,
  setAssetStyle,
  resetAssetStyle,
  setOpenSideContextMenu
}

export const MenuItemAsset: any = compose(
  withNamespaces('asset'),
  connect(mapStateToProps, mapDispatchToProps)
)(Component)
