// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Router } from '@reach/router'
import { Fill } from '@ehv/react-slots'

const Foo = ({ children, render, ...props }) => {
  return render(props)
}

export default class Route extends React.PureComponent {
  render () {
    const { parent = 'core', path, children, ...props } = this.props
    return (
      <Fill slot={`${parent}.router`}>
        {() => (
          <Router>
            <Foo {...props} path={path} render={children} />
          </Router>
        )}
      </Fill>
    )
  }
}
