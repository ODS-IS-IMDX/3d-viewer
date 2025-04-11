// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'

import { isLoading } from '../../selectors'
import SiteLoading from './SiteLoading'

const mapStateToProps = state => ({
  isLoading: isLoading(state)
})

export default connect(mapStateToProps, null)(SiteLoading)
