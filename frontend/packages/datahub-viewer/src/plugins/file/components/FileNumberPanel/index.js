// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import {
  getTilingFilesNumber as getTilingFilesNumberInSelector,
  getNeedUploadFilesNumber,
  getErrorFilesNumber
} from 'plugins/file/selectors'
import { FileNumberPanel as component } from './FileNumberPanel'

const mapStateToProps = state => ({
  tileNumber: getTilingFilesNumberInSelector(state),
  needUploadNumber: getNeedUploadFilesNumber(state),
  errorNumber: getErrorFilesNumber(state)
})

export const FileNumberPanel = compose(
  withNamespaces('file'),
  connect(mapStateToProps)
)(component)
