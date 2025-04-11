// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { Primitive as CesiumPrimitive } from 'cesium'

import CesiumComponent from '../CesiumComponent'
import PrimitivesContext from '../PrimitivesContext'

export class Primitive extends React.PureComponent {
  constructor (props) {
    super(props)
    this.mount = this.mount.bind(this)
    this.create = this.create.bind(this)
    this.unmount = this.unmount.bind(this)
  }

  create () {
    return new CesiumPrimitive(this.props)
  }

  mount (entity) {
    this.props.primitives.add(entity)
  }

  unmount (entity) {
    this.props.primitives.remove(entity)
  }

  render () {
    return (
      <CesiumComponent
        {...this.props}
        ref={this.props._ref}
        mount={this.mount}
        create={this.create}
        unmount={this.unmount}
        cesiumProps={this.constructor.cesiumProps}
        cesiumEvents={this.constructor.cesiumEvents}
        cesiumReadOnlyProps={this.constructor.cesiumReadOnlyProps}
      />
    )
  }
}

Primitive.cesiumProps = [
  'appearance',
  'cull',
  'debugShowBoundingVolume',
  'depthFailAppearance',
  'modelMatrix',
  'shadows',
  'show'
]

Primitive.cesiumReadOnlyProps = [
  'allowPicking',
  'asynchronous',
  'compressVertices',
  'geometryInstances',
  'interleave',
  'ready',
  'readyPromise',
  'releaseGeometryInstances',
  'vertexCacheOptimize'
]

Primitive.cesiumEvents = ['definitionChanged']

export const PrimitiveContainer = React.forwardRef((props, ref) => (
  <PrimitivesContext.Consumer>
    {primitives => <Primitive {...props} _ref={ref} primitives={primitives} />}
  </PrimitivesContext.Consumer>
))
