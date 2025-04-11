// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import { deleteFile } from 'plugins/file/actions/'
import { FileDeleteConfirmModal as Modal } from './FileDeleteConfirmModal'

const mapDispatchToProps = { deleteFile }

export const FileDeleteConfirmModal = compose(
  withNamespaces('file'),
  connect(null, mapDispatchToProps)
)(Modal)
