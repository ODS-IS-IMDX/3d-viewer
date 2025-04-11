// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'

import { DataRoute as DataRouteComponent } from './DataRoute'
import { getIsDrawerOpen } from 'plugins/data/selectors'
import { getIsMobile } from 'plugins/site/selectors'

const mapStateToProps = state => ({
  isDrawerOpen: getIsDrawerOpen(state),
  isMobile: getIsMobile(state)
})

export const DataRoute = connect(mapStateToProps)(DataRouteComponent)
