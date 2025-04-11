// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import {
  deleteFileFromList,
  clearPrepareFiles,
  selectFile,
  startWatchUploadFile,
  uploadFiles
} from 'plugins/file/actions'
import { getUploadFileList } from 'plugins/file/selectors'
import { FileListModal as FileListModalComponent } from './FileListModal'

const mapStateToProps = state => ({
  fileList: getUploadFileList(state)
})

const mapDispatchToProps = {
  deleteFileFromList,
  clearPrepareFiles,
  selectFile,
  startWatchUploadFile,
  uploadFiles
}

export const FileListModal = compose(
  withNamespaces('file'),
  connect(mapStateToProps, mapDispatchToProps)
)(FileListModalComponent)
