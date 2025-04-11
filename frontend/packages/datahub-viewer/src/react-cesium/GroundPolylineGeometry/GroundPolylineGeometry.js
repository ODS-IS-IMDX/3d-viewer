// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import {
  GroundPolylineGeometry as CesiumGroundPolylineGeometry,
  GeometryInstance,
  GroundPolylinePrimitive,
  PolylineMaterialAppearance
} from 'cesium'

import CesiumComponent from '../CesiumComponent'
import SceneContext from '../SceneContext'
import PolylineGeometryContext from '../GroundPolylineGeometryContext'

export class GroundPolylineGeometry extends React.PureComponent {
  constructor (props) {
    super(props)
    this.mount = this.mount.bind(this)
    this.create = this.create.bind(this)
    this.unmount = this.unmount.bind(this)
    this.children = this.children.bind(this)
  }

  create () {
    return new CesiumGroundPolylineGeometry(this.props)
  }

  mount (geometry) {
    const { id, material } = this.props
    this.primitive = new GroundPolylinePrimitive({
      geometryInstances: new GeometryInstance({
        id,
        geometry
      }),
      appearance: new PolylineMaterialAppearance({ material })
    })
    this.props.groundPrimitives.add(this.primitive)
  }

  unmount (geometry) {
    const { groundPrimitives } = this.props
    const viewer = this.props.viewer
    !groundPrimitives.isDestroyed() && groundPrimitives.remove(this.primitive)
    viewer && viewer.scene.requestRender()
  }

  children (element) {
    return (
      <PolylineGeometryContext.Provider value={element}>
        {typeof this.props.children === 'function'
          ? this.props.children(element)
          : this.props.children}
      </PolylineGeometryContext.Provider>
    )
  }

  render () {
    return (
      <CesiumComponent
        {...this.props}
        ref={this.props._ref}
        mount={this.mount}
        create={this.create}
        unmount={this.unmount}
        children={this.children}
        cesiumProps={this.constructor.cesiumProps}
        cesiumEvents={this.constructor.cesiumEvents}
        cesiumReadOnlyProps={this.constructor.cesiumReadOnlyProps}
      />
    )
  }

  componentDidMount () {
    const viewer = this.props.viewer
    viewer && viewer.scene.requestRender()
  }

  componentDidUpdate () {
    const viewer = this.props.viewer
    viewer && viewer.scene.requestRender()
  }
}

GroundPolylineGeometry.cesiumProps = [
  'arcType',
  'granularity',
  'loop',
  'material',
  'width'
]

GroundPolylineGeometry.cesiumEvents = ['pack', 'unpack']

GroundPolylineGeometry.cesiumReadOnlyProps = ['id', 'positions']

export const GroundPolylineGeometryContainer = React.forwardRef(
  (props, ref) => (
    <SceneContext.Consumer>
      {scene => (
        <GroundPolylineGeometry
          {...props}
          _ref={ref}
          groundPrimitives={scene.groundPrimitives}
        />
      )}
    </SceneContext.Consumer>
  )
)
