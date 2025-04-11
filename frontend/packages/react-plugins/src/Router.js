// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Router as ReachRouter } from '@reach/router'
import { Fill } from '@ehv/react-slots'

export default class Router extends React.PureComponent {
  render () {
    const { parent = 'core', children, ...props } = this.props
    return (
      <Fill slot={`${parent}.router`}>
        {() => <ReachRouter {...props}>{children}</ReachRouter>}
      </Fill>
    )
  }
}
