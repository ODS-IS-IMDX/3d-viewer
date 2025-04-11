// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { getUserProfile } from 'addons/auth/selectors'
import SiteUserContextMenu from './SiteUserContextMenu'
import { getIsMobile } from '../../selectors/mobile'

const mapStateToProps = state => {
  const { language, firstName, lastName, site, email } = getUserProfile(state)
  return {
    language,
    firstName,
    lastName,
    email,
    site,
    isMobile: getIsMobile(state)
  }
}

export default compose(
  withNamespaces('site'),
  connect(mapStateToProps)
)(SiteUserContextMenu)
