// Copyright (c) 2025 NTT InfraNet
// @flow
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import MenuItemDeleteModal from './MenuItemDeleteModal'
import { getDeleteItem } from '../../selectors/delete'
import { setDeleteItem, deleteFile } from '../../actions'
import { getViewStructure } from 'plugins/site/selectors'

const mapStateToProps = state => ({
  getDeleteItem: getDeleteItem(state),
  viewStructure: getViewStructure(state)
})

const mapDispatchToProps = {
  setDeleteItem,
  deleteFile
}

export default compose(
  withNamespaces('data'),
  connect(mapStateToProps, mapDispatchToProps)
)(MenuItemDeleteModal)
