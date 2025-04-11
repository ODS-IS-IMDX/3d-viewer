// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { StoreUpdater } from './StoreUpdater'
import { checkSite } from '../../actions'
import { getSiteId } from 'plugins/site/selectors'

const mapStateToProps = state => ({
  siteId: getSiteId(state)
})

const mapDispatchToProps = {
  checkSite
}

export default compose(
  withNamespaces('site'),
  connect(mapStateToProps, mapDispatchToProps)
)(StoreUpdater)
