// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import TopographyLayers from './TopographyLayers'
import { getAvailableTopographyList } from '../../../selectors'
import { getViewer } from '../../../../site/selectors'
import {
  setTopographyVisibility,
  setAssetRenderingState,
  setAssetAvailable,
  notifyTopographyRenderingCompleted
} from '../../../actions'
import { notifyError } from '../../../../notifications/actions'

const mapStateToProps = state => ({
  topographyList: getAvailableTopographyList(state),
  viewer: getViewer(state)
})

const mapDispatchToProps = {
  notifyError,
  setTopographyVisibility,
  setAssetRenderingState,
  setAssetAvailable,
  notifyTopographyRenderingCompleted
}

export default compose(
  withNamespaces('asset'),
  connect(mapStateToProps, mapDispatchToProps)
)(TopographyLayers)
