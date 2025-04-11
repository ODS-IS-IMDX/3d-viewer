// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { ScreenSpaceEventHandler as CesiumScreenSpaceEventHandler } from 'cesium'

import CanvasContext from '../CanvasContext'
import CesiumComponent from '../CesiumComponent'
import ScreenSpaceEventHandlerContext from '../ScreenSpaceEventHandlerContext'

export class ScreenSpaceEventHandler extends React.PureComponent {
  constructor (props) {
    super(props)
    this.create = this.create.bind(this)
    this.unmount = this.unmount.bind(this)
    this.children = this.children.bind(this)
  }

  create () {
    return new CesiumScreenSpaceEventHandler(this.props.canvas)
  }

  unmount (handler) {
    handler.destroy()
  }

  children (element) {
    return (
      <ScreenSpaceEventHandlerContext.Provider value={element}>
        {this.props.children}
      </ScreenSpaceEventHandlerContext.Provider>
    )
  }

  render () {
    return (
      <CesiumComponent
        {...this.props}
        ref={this.props._ref}
        create={this.create}
        unmount={this.unmount}
        children={this.children}
      />
    )
  }
}

export const ScreenSpaceEventHandlerContainer = React.forwardRef(
  (props, ref) => (
    <CanvasContext.Consumer>
      {canvas => (
        <ScreenSpaceEventHandler {...props} _ref={ref} canvas={canvas} />
      )}
    </CanvasContext.Consumer>
  )
)

export class InputAction extends React.PureComponent {
  componentDidMount () {
    const { type, action, modifier, screenSpaceEventHandler } = this.props

    if (action) {
      screenSpaceEventHandler.setInputAction(action, type, modifier)
    } else {
      screenSpaceEventHandler.removeInputAction(type, modifier)
    }
  }

  componentWillUnmount () {
    const { type, action, modifier, screenSpaceEventHandler } = this.props

    if (!screenSpaceEventHandler.isDestroyed() && action) {
      screenSpaceEventHandler.removeInputAction(type, modifier)
    }
  }

  componentDidUpdate (prevProps) {
    const { type, action, modifier, screenSpaceEventHandler } = this.props

    if (prevProps.action) {
      screenSpaceEventHandler.removeInputAction(
        prevProps.type,
        prevProps.modifier
      )
    }

    if (action) {
      screenSpaceEventHandler.setInputAction(action, type, modifier)
    } else {
      screenSpaceEventHandler.removeInputAction(type, modifier)
    }
  }

  render () {
    return null
  }
}

export const InputActionContainer = props => (
  <ScreenSpaceEventHandlerContext.Consumer>
    {screenSpaceEventHandler => (
      <InputAction
        {...props}
        screenSpaceEventHandler={screenSpaceEventHandler}
      />
    )}
  </ScreenSpaceEventHandlerContext.Consumer>
)
