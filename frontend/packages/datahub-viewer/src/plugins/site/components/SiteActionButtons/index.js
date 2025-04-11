// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'

import { getAccessToken } from 'addons/auth'
import SiteActionButtons from './SiteActionButtons'

const mapStateToProps = state => ({
  isCreateButtonEnabled: false,
  hasAccessToken: !!getAccessToken(state)
})

export default connect(mapStateToProps, null)(SiteActionButtons)
