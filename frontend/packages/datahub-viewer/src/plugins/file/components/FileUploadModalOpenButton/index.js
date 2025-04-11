// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { FileUploadModalOpenButton as FileUploadModalOpenButtonComponent } from './FileUploadModalOpenButton'

const mapStateToProps = state => ({
  // NOTE: 3DVでは現場権限などはないので、常にtrueを返す
  isEnabled: true
})

export const FileUploadModalOpenButton = compose(
  withNamespaces('file'),
  connect(mapStateToProps, null)
)(FileUploadModalOpenButtonComponent)
