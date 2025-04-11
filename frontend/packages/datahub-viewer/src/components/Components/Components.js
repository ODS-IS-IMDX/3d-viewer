// Copyright (c) 2025 NTT InfraNet
import React from 'react'

export class Components extends React.PureComponent {
  render () {
    const { slots, slot, ...props } = this.props
    const components = slots[slot] || []
    return (
      <React.Fragment>
        {components.map((Component, index) => (
          <Component key={index} {...props} />
        ))}
      </React.Fragment>
    )
  }
}
