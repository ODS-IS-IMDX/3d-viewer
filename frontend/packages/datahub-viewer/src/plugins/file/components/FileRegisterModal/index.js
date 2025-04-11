// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { setFilesInfo } from 'plugins/file/actions'
import { getSelectedFileIndex, getUploadFileList } from 'plugins/file/selectors'
import { getBaseTerrainList } from 'plugins/asset/selectors'
import { FileRegisterModal as FileRegisterModalComponent } from './FileRegisterModal'

const mapStateToProps = state => ({
  fileList: getUploadFileList(state),
  baseTerrainList: getBaseTerrainList(state),
  index: getSelectedFileIndex(state)
})

const mapDispatchToProps = {
  setFilesInfo
}

export const FileRegisterModal: any = compose(
  withNamespaces('file'),
  connect(mapStateToProps, mapDispatchToProps)
)(FileRegisterModalComponent)
