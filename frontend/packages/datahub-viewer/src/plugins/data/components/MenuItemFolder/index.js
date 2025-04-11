// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { getIsMobile } from '../../../site/selectors'
import { MenuItemFolder as Component } from './MenuItemFolder'

const mapStateToProps = state => ({
  isMobile: getIsMobile(state)
})

export const MenuItemFolder = connect(mapStateToProps, null)(Component)

export default MenuItemFolder
