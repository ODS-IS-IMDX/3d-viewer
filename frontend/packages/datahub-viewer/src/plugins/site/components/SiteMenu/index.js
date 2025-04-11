// Copyright (c) 2025 NTT InfraNet
// @flow
import * as React from 'react'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  getActiveSideBarIconName,
  getIsMobile,
  getOpenViewName
} from '../../selectors'
import SiteMenu from './SiteMenu'

export type SiteMenuProps = {
  t: (value: string) => string,
  onlyLogoRow: Boolean,
  children: React.Node,
  width: number,
  snapping: Array<number>,
  activeIconName?: string | null,
  isMobile: Boolean,
  openViewName: string | null
}

const mapStateToProps = state => ({
  activeIconName: getActiveSideBarIconName(state),
  isMobile: getIsMobile(state),
  openViewName: getOpenViewName(state)
})

export default compose(
  withNamespaces('site'),
  connect(mapStateToProps, null)
)(SiteMenu)
