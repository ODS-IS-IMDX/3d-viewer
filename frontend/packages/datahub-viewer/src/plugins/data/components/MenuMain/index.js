// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { MenuMain as Component } from './MenuMain'
import { getMenuMode } from 'plugins/data/selectors/meta'

const mapStateToProps = state => ({
  menuMode: getMenuMode(state)
})

export const MenuMain: any = compose(
  withNamespaces('data'),
  connect(mapStateToProps)
)(Component)
