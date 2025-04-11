// Copyright (c) 2025 NTT InfraNet
import { connect } from 'react-redux'
import { NotificationContainer as Component } from './NotificationContainer'
import { getIsMobile } from 'plugins/site/selectors'

const mapStateToProps = state => ({
  isMobile: getIsMobile(state)
})

export default connect(mapStateToProps)(Component)
