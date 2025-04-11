// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { SceneContext } from './context'

class Scene extends React.PureComponent {
  constructor (props) {
    super(props)
    for (const prop in props) {
      props.scene[prop] = props[prop]
    }
  }

  componentDidUpdate () {
    for (const prop in this.props) {
      this.props.globe[prop] = this.props[prop]
    }
  }

  render () {
    return null
  }
}

const SceneContainer = props => (
  <SceneContext.Consumer>
    {scene => <Scene {...props} scene={scene} />}
  </SceneContext.Consumer>
)

export default SceneContainer
