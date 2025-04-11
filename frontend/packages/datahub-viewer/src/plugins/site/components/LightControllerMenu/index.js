// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { getViewer, getShadowOptions } from 'plugins/site/selectors'
import { setShadowOptions } from 'plugins/site/actions'
import Menu from './LightControllerMenu'

const mapStateToProps = state => ({
  viewer: getViewer(state),
  shadowOptions: getShadowOptions(state)
})

const mapDispatchToProps = {
  setShadowOptions
}

export const LightControllerMenu = compose(
  withNamespaces('site'),
  connect(mapStateToProps, mapDispatchToProps)
)(Menu)

export default LightControllerMenu
