// Copyright (c) 2025 NTT InfraNet
// @flow
import React, { PureComponent } from 'react'
import { convertPositionToGeoJSONCoordinate } from 'utils/cesium'

import Draggable from '../Draggable'

const initialState = {
  isDragging: false,
  dragingPoint: {
    type: '',
    position: {},
    index: 0,
    replace: false
  }
}
export default function GeoJSONFactory (geometriesMap = {}) {
  return class GeoJSONFactory extends PureComponent {
    state = initialState

    pointRefs = new Map()

    onPointRef = key => ref => this.pointRefs.set(key, ref && ref.element)

    onDragPoint = onDrag => position => {
      const { dragingPoint } = this.state

      onDrag && onDrag(convertPositionToGeoJSONCoordinate(position))
      this.setState({
        dragingPoint: {
          ...dragingPoint,
          position
        }
      })
    }

    onDragPointStart = (index, type, replace = false) => position => {
      this.setState({
        isDragging: true,
        dragingPoint: {
          index,
          type,
          replace
          // position:
        }
      })
    }

    onDragPointEnd = onDragEnd => () => {
      const { isDragging, dragingPoint: { position } = {} } = this.state

      if (!isDragging) {
        return
      }

      onDragEnd && onDragEnd(convertPositionToGeoJSONCoordinate(position))
      this.setState(initialState)
    }

    render () {
      const { data = {}, ...props } = this.props

      // TODO: Use a WeakMap to improve the garabage collection of this in case a pluggin is unregistered
      const features = data.features ? data.features : [data]

      return (
        <>
          {features.map((feature, index) => {
            const { isDragging, dragingPoint } = this.state
            const {
              id,
              geometry: { type } = {},
              properties: { draggable, onDrag, onDragEnd } = {}
            } = feature
            const GeometryComponent = geometriesMap[type]

            if (!GeometryComponent) {
              console.info(`There is no feature available for ${type}`)

              return null
            }

            let draggableFeature
            if (draggable) {
              if (isDragging && dragingPoint.position) {
                const { position } = dragingPoint
                const newPosition = convertPositionToGeoJSONCoordinate(position)
                draggableFeature = {
                  ...feature,
                  geometry: {
                    ...feature.geometry,
                    coordinates: newPosition.slice(0, 2)
                  }
                }
              } else {
                draggableFeature = feature
              }
            }

            if (draggable) {
              return (
                <Draggable
                  ref={this.onPointRef(index)}
                  key={index}
                  position={draggableFeature}
                  onDrag={this.onDragPoint(onDrag)}
                  onDragStart={this.onDragPointStart(index, 'update', true)}
                  onDragEnd={this.onDragPointEnd(onDragEnd)}
                >
                  {ref => {
                    return (
                      <GeometryComponent
                        ref={ref}
                        {...props}
                        feature={draggableFeature}
                        key={id || index}
                      />
                    )
                  }}
                </Draggable>
              )
            } else {
              return (
                <GeometryComponent
                  {...props}
                  feature={feature}
                  key={id || index}
                />
              )
            }
          })}
        </>
      )
    }
  }
}
