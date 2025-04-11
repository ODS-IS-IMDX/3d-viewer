// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'

import { getIsLoading } from '../../selectors/delete'
import MenuItemDeleteLoading from './MenuItemDeleteLoading'

const mapStateToProps = state => ({
  isLoading: getIsLoading(state)
})

export default connect(mapStateToProps, null)(MenuItemDeleteLoading)
