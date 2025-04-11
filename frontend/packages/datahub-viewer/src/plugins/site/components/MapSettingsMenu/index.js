// Copyright (c) 2025 NTT InfraNet
// @flow
import { withNamespaces } from 'react-i18next'
import MapSettingsMenu from './MapSettingsMenu.js'
import { getIsMobile } from '../../selectors/mobile'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getUserProfile } from 'addons/auth/selectors'

const mapStateToProps = state => ({
  isMobile: getIsMobile(state),
  userProfile: getUserProfile(state)
})

export default compose(
  withNamespaces('site'),
  connect(mapStateToProps, null)
)(MapSettingsMenu)
