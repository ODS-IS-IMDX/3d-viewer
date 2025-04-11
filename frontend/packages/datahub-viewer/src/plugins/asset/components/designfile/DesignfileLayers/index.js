// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import DesignfileLayers from './DesignfileLayers'
import { getAvailableDesignfileList } from '../../../selectors'
import { getViewer } from '../../../../site/selectors'
import {
  setDesignfileVisibility,
  setAssetRenderingState,
  setAssetAvailable,
  setAssetIsTransparency,
  setAssetStyle,
  notifyDesignfileRenderingCompleted
} from '../../../actions'
import { notifyError } from '../../../../notifications/actions'

const mapStateToProps = state => ({
  designfileList: getAvailableDesignfileList(state),
  viewer: getViewer(state)
})

const mapDispatchToProps = {
  notifyError,
  setDesignfileVisibility,
  setAssetRenderingState,
  setAssetAvailable,
  setAssetIsTransparency,
  setAssetStyle,
  notifyDesignfileRenderingCompleted
}

export default compose(
  withNamespaces('asset'),
  connect(mapStateToProps, mapDispatchToProps)
)(DesignfileLayers)
