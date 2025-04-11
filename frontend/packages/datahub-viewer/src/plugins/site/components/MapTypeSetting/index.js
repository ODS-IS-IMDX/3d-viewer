// Copyright (c) 2025 NTT InfraNet
// @flow
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import MapTypeSetting from './MapTypeSetting'
import { getSite } from '../../selectors'

const mapStateToProps = state => ({
  site: getSite(state)
})

export default compose(
  withNamespaces(),
  connect(mapStateToProps)
)(MapTypeSetting)
