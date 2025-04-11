// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import {
  cancelEditAsset,
  disableDrawerButton,
  enableDrawerButton,
  editAsset,
  updateEditingData
} from 'plugins/asset/actions'
import {
  getAssetMetaData,
  getDrawerButtonEnabled,
  getEditingData,
  getTransformEditor,
  isDrawerOpen
} from 'plugins/asset/selectors'
import { AssetEditDrawer } from './AssetEditDrawer'

const mapStateToProps = state => ({
  isDrawerOpen: isDrawerOpen(state),
  isDrawerButtonEnabled: getDrawerButtonEnabled(state),
  asset: getAssetMetaData(state),
  transformEditor: getTransformEditor(state),
  editingData: getEditingData(state)
})

const mapDispatchToProps = {
  updateEditingData,
  editAsset,
  cancelEditAsset,
  disableDrawerButton,
  enableDrawerButton
}

export default compose(
  withNamespaces('asset'),
  connect(mapStateToProps, mapDispatchToProps)
)(AssetEditDrawer)
