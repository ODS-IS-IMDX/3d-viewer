// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { putFilesIntoState } from 'plugins/file/actions/'
import { FileInputModal as FileInputModalComponent } from './FileInputModal'

const mapDispatchToProps = {
  putFilesIntoState
}

export const FileInputModal = compose(
  withNamespaces('file'),
  connect(null, mapDispatchToProps)
)(FileInputModalComponent)
