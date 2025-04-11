// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { getAssetList } from 'plugins/asset/selectors'
import { changeMenuMode } from 'plugins/data/actions'
import { setViewStructure } from 'plugins/site/actions'
import { getViewStructure } from 'plugins/site/selectors'
import { notifyError } from 'plugins/notifications/actions'
import { MenuEdit as Component } from './MenuEdit'
import { setDeleteItem } from '../../actions/delete'

const mapStateToProps = state => ({
  assetList: getAssetList(state),
  viewStructure: getViewStructure(state)
})

const mapDispatchToProps = {
  changeMenuMode,
  notifyError,
  setViewStructure,
  setDeleteItem
}

export const MenuEdit = compose(
  withNamespaces('data'),
  connect(mapStateToProps, mapDispatchToProps)
)(Component)

export default MenuEdit
