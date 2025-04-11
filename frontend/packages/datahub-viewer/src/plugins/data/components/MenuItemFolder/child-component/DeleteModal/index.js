// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { FILE_TYPE } from 'plugins/file/constants'

import { deleteFile } from 'plugins/file/actions'
import Modal from './DeleteModal'

const mapDispatchToProps = dispatch => ({
  deleteBlackboard: (id: string) =>
    dispatch(deleteFile(FILE_TYPE.BLACKBOARD, id))
})

export const DeleteModal = compose(
  withNamespaces('data'),
  connect(null, mapDispatchToProps)
)(Modal)
