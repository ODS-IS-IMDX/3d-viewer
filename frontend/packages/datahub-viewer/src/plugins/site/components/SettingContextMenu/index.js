// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { compose } from 'redux'
import SettingContextMenu from './SettingContextMenu'
import { getUserProfile } from 'addons/auth/selectors'

const mapStateToProps = state => ({
  userProfile: getUserProfile(state)
})
const mapDispatchToProps = {}

export default compose(
  withNamespaces('site'),
  connect(mapStateToProps, mapDispatchToProps)
)(SettingContextMenu)
