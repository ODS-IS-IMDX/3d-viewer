// Copyright (c) 2025 NTT InfraNet
// @flow
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import { compose } from 'redux'

import { getSiteCCRS } from 'plugins/site/selectors'
import { unitConverter } from 'utils/convertUnits'

import SiteViewerContextMenu from './SiteViewerContextMenu'

const mapStateToProps = state => {
  const siteCCRS = getSiteCCRS(state)
  const { lengthUnit } = unitConverter(siteCCRS)

  return {
    unit: lengthUnit
  }
}

export default compose(
  connect(mapStateToProps),
  withNamespaces('site')
)(SiteViewerContextMenu)
