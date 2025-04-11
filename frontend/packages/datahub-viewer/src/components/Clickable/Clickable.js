// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import { defined, Cartesian2 } from 'cesium'
import { SceneContext, CanvasContext } from '../../react-cesium'

export class Clickable extends PureComponent {
  ref = this.props.forwardedRef || React.createRef()

  componentWillMount () {
    this.props.canvas.addEventListener('pointerdown', this.onPointerDown)
  }

  componentWillUnmount () {
    this.props.canvas.removeEventListener('pointerdown', this.onPointerDown)
  }

  onPointerDown = (event: PointerEvent) => {
    const picked = this.props.scene.pick(
      new Cartesian2(event.offsetX, event.offsetY)
    )
    if (defined(picked) && picked.id === this.ref.current.element) {
      this.props.onClick && this.props.onClick()
    }
  }

  onRef = ref => {
    this.ref = { current: ref }
    this.props.forwardedRef(ref)
  }

  render () {
    const ref =
      typeof this.props.forwardedRef === 'function' ? this.onRef : this.ref
    return this.props.children(ref)
  }
}

export const ClickableContainer = React.forwardRef((props, ref) => (
  <SceneContext.Consumer>
    {scene => (
      <CanvasContext.Consumer>
        {canvas => (
          <Clickable
            {...props}
            forwardedRef={ref}
            scene={scene}
            canvas={canvas}
          />
        )}
      </CanvasContext.Consumer>
    )}
  </SceneContext.Consumer>
))
