// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { ContextMenuWithButton as Component } from './ContextMenuWithButton'
import { getMenuMode } from 'plugins/data/selectors'

const mapStateToProps = state => ({
  menuMode: getMenuMode(state)
})

export const ContextMenuWithButton = compose(
  withNamespaces('data'),
  connect(mapStateToProps)
)(Component)
