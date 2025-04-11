// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { FileProgressModal as Component } from './FileProgressModal'
import {
  pollingTilingFilesProgress,
  stopPollingTilingFilesProgress
} from 'plugins/file/actions'

const mapDispatchToProps = {
  pollingTilingFilesProgress,
  stopPollingTilingFilesProgress
}

export const FileProgressModal = compose(
  withNamespaces('file'),
  connect(null, mapDispatchToProps)
)(Component)
