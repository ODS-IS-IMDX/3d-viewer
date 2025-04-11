// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { GlobeContext } from './context'

// TODO: should be removed
class Globe extends React.PureComponent {
  constructor (props) {
    super(props)
    const { globe } = props
    for (const prop in props) {
      globe[prop] = props[prop]
    }
  }

  componentDidUpdate () {
    const { globe } = this.props
    for (const prop in this.props) {
      globe[prop] = this.props[prop]
    }
  }

  render () {
    return null
  }
}

const GlobeContainer = props => (
  <GlobeContext.Consumer>
    {globe => <Globe {...props} globe={globe} />}
  </GlobeContext.Consumer>
)

export default GlobeContainer
