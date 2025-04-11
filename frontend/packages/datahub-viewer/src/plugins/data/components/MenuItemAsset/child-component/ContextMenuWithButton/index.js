// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { getSiteId } from 'plugins/site/selectors'
import { ContextMenuWithButton as Component } from './ContextMenuWithButton'
import { getIsDrawerOpen } from 'plugins/data/selectors'
import { getDownloadingFileIdList } from 'plugins/file/selectors'
import { initEditingData, setAssetRenderingState } from 'plugins/asset/actions'
import { downloadFile, addIntoDownloadingList } from 'plugins/file/actions'
import { closeDrawer as closeTimelineDrawer } from 'plugins/data/actions'

const mapStateToProps = state => ({
  siteId: getSiteId(state),
  downloadingFileIdList: getDownloadingFileIdList(state),
  isDeleteButtonEnabled: false,
  isTimelineDrawerOpen: getIsDrawerOpen(state)
})

const mapDispatchToProps = {
  addIntoDownloadingList,
  downloadFile,
  setAssetRenderingState,
  initAssetEditingData: initEditingData,
  closeTimelineDrawer
}

export const ContextMenuWithButton = compose(
  withNamespaces('asset'),
  connect(mapStateToProps, mapDispatchToProps)
)(Component)
