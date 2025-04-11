// Copyright (c) 2025 NTT InfraNet
import React from 'react'

import SceneContext from './SceneContext'

class ScreenSpaceCameraController extends React.PureComponent {
  constructor (props) {
    super(props)
    const { screenSpaceCameraController } = props
    for (const prop in props) {
      screenSpaceCameraController[prop] = props[prop]
    }
  }

  render () {
    return null
  }
}

const ScreenSpaceCameraControllerContainer = props => (
  <SceneContext.Consumer>
    {scene => (
      <ScreenSpaceCameraController
        {...props}
        screenSpaceCameraController={scene.screenSpaceCameraController}
      />
    )}
  </SceneContext.Consumer>
)

export default ScreenSpaceCameraControllerContainer
