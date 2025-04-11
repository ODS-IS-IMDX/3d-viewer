// Copyright (c) 2025 NTT InfraNet
import React from 'react'
import { EllipsoidTerrainProvider } from 'cesium'
import { createWorldTerrainAsync } from '@cesium/engine'

import CesiumAsyncComponent from '../CesiumAsyncComponent'
import GlobeContext from '../GlobeContext'

export class CesiumWorldTerrainProvider extends React.PureComponent {
  constructor (props) {
    super(props)
    this.mount = this.mount.bind(this)
    this.create = this.create.bind(this)
    this.unmount = this.unmount.bind(this)
  }

  create () {
    return createWorldTerrainAsync(this.props)
  }

  mount (element) {
    this.props.globe.terrainProvider = element
  }

  unmount (element) {
    this.props.globe.terrainProvider = new EllipsoidTerrainProvider()
  }

  render () {
    return (
      <CesiumAsyncComponent
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

CesiumWorldTerrainProvider.cesiumProps = [
  'availability',
  'credit',
  'hasVertexNormals',
  'hasWaterMask',
  'ready',
  'requestVertexNormals',
  'requestWaterMask',
  'tilingScheme'
]

CesiumWorldTerrainProvider.cesiumEvents = ['errorEvent']

CesiumWorldTerrainProvider.cesiumReadOnlyProps = ['readyPromise']

export const CesiumWorldTerrainProviderContainer = React.forwardRef(
  (props, ref) => (
    <GlobeContext.Consumer>
      {globe => (
        <CesiumWorldTerrainProvider {...props} _ref={ref} globe={globe} />
      )}
    </GlobeContext.Consumer>
  )
)
