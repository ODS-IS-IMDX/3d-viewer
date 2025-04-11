// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'

import { getNotificationsIsLoading } from '../../selectors/notifications'
import SiteNotificationsLoading from './SiteNotificationsLoading'

const mapStateToProps = state => ({
  isLoading: getNotificationsIsLoading(state)
})

const mapDispatchToProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SiteNotificationsLoading)
