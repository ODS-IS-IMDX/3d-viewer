// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { FileProgressModalList as Component } from './FileProgressModalList'
import { getTilingFileList, getUploadFileList } from 'plugins/file/selectors'
import { cancelUpload, deleteFile } from 'plugins/file/actions'

const mapStateToProps = state => ({
  tileFileList: getTilingFileList(state),
  uploadFileList: getUploadFileList(state)
})

const mapDispatchToProps = {
  cancelUpload,
  deleteFile
}

export const FileProgressModalList = compose(
  withNamespaces('file'),
  connect(mapStateToProps, mapDispatchToProps)
)(Component)
