// Copyright (c) 2025 NTT InfraNet
// @flow
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withNamespaces } from 'react-i18next'
import {
  CameraContext,
  CanvasContext,
  SceneContext
} from '../../../../react-cesium'

import { unitConverter } from 'utils/convertUnits'

import { getSiteCCRS } from '../../../site/selectors'
import ScaleComponent from './Scale'

const Scale = props => (
  <CameraContext.Consumer>
    {camera => (
      <CanvasContext.Consumer>
        {canvas => (
          <SceneContext.Consumer>
            {scene => (
              <ScaleComponent
                {...props}
                scene={scene}
                camera={camera}
                canvas={canvas}
              />
            )}
          </SceneContext.Consumer>
        )}
      </CanvasContext.Consumer>
    )}
  </CameraContext.Consumer>
)

const mapStateToProps = state => {
  const siteCCRS = getSiteCCRS(state)

  return {
    converter: siteCCRS && unitConverter(siteCCRS),
    siteCCRS
  }
}

export default compose(withNamespaces(), connect(mapStateToProps))(Scale)
