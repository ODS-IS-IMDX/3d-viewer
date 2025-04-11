// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { getLanguage } from 'addons/auth/selectors'
import { InfoContextMenu as Component } from './InfoContextMenu'

const mapStateToProps = state => ({
  language: getLanguage(state)
})

export const InfoContextMenu = compose(
  withNamespaces('data'),
  connect(mapStateToProps)
)(Component)
