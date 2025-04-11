// Copyright (c) 2025 NTT InfraNet
import React from 'react'

import { CallbackProperty, ScreenSpaceEventType } from 'cesium'

import { ScreenSpaceEventHandler } from 'react-cesium'

export class Draggable extends React.Component {
  state = {
    dragging: false,
    position: this.props.position
  }

  ref = this.props.fRef || React.createRef()

  callback = new CallbackProperty(() => this.state.position, false)

  dragStart = event => {
    this.setState(
      {
        dragging: true
      },
      () => {
        this.props.onDragStart(this.state.position)
      }
    )
  }

  dragEnd = event => {
    if (this.state.dragging) {
      this.setState(
        {
          dragging: false
        },
        () => {
          this.props.onDragEnd(this.state.position)
        }
      )
    }
  }

  onLeftDown = event => {
    if (!event.position) {
      return
    }
    const pickedElements = this.props.scene.drillPick(event.position)
    const isCurrentElement = pickedElements.some(
      picked => picked.id === this.ref.current.element
    )

    if (isCurrentElement) {
      this.props.scene.screenSpaceCameraController.enableRotate = false
      this.timer = setTimeout(() => this.dragStart(event), 150)
    }
  }

  onMove = event => {
    if (this.state.dragging) {
      const position = this.props.scene.globe.pick(
        this.props.camera.getPickRay(event.endPosition),
        this.props.scene
      )
      if (!position) {
        return
      }

      this.setState(
        {
          position
        },
        () => {
          this.props.onDrag(this.state.position)
        }
      )
    }
  }

  onLeftUp = event => {
    if (this.timer) {
      clearTimeout(this.timer)
      this.dragEnd(event)
      this.timer = undefined
      this.props.scene.screenSpaceCameraController.enableRotate = true
    }
  }

  onRef = ref => {
    this.ref = { current: ref }
    this.props.fRef(ref)
  }

  render () {
    const ref = typeof this.props.fRef === 'function' ? this.onRef : this.ref

    return (
      <React.Fragment>
        {this.props.children(ref, {
          dragging: this.state.dragging,
          position: this.callback,
          coordinates: this.state.position
        })}
        <ScreenSpaceEventHandler>
          <ScreenSpaceEventHandler.InputAction
            action={this.onLeftDown}
            type={ScreenSpaceEventType.LEFT_DOWN}
          />
          <ScreenSpaceEventHandler.InputAction
            action={this.onMove}
            type={ScreenSpaceEventType.MOUSE_MOVE}
          />
          <ScreenSpaceEventHandler.InputAction
            action={this.onLeftUp}
            type={ScreenSpaceEventType.LEFT_UP}
          />
        </ScreenSpaceEventHandler>
      </React.Fragment>
    )
  }
}

Draggable.defaultProps = {
  onDrag: () => {},
  onDragEnd: () => {},
  onDragStart: () => {}
}

export const DraggableContainer = React.forwardRef((props, ref) => (
  <Draggable fRef={ref} {...props} />
))
