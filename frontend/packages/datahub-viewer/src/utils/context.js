// Copyright (c) 2025 NTT InfraNet
import React from 'react'

export function getDisplayName (Component) {
  return Component.displayName || Component.name || 'Component'
}

export class ConnectConsumers extends React.PureComponent {
  wrap = ([[name, Consumer], ...rest], values = {}) => (
    <Consumer>
      {value =>
        rest.length !== 0
          ? this.wrap(rest, { ...values, [name]: value })
          : this.props.children({ ...values, [name]: value })
      }
    </Consumer>
  )

  render () {
    return this.wrap(this.props.consumers, this.props.children)
  }
}

export const withContext = consumersMap => Component => {
  const consumers = Object.entries(consumersMap)
  const Container = React.forwardRef((props, ref) => (
    <ConnectConsumers consumers={consumers}>
      {values => <Component ref={ref} {...props} {...values} />}
    </ConnectConsumers>
  ))
  Container.displayName = `WithContext(${getDisplayName(Component)})`
  return Container
}
